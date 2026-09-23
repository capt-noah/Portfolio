/**
 * NotFlix Stream Resolver Engine (Phase 2)
 * High-performance, zero-ad stream resolution and HLS manifest proxying.
 * Supports web clients (via hls.js & CORS proxy) and native macOS (Swift AVPlayer with custom headers).
 */

import { Readable } from 'node:stream';

// Graceful import for tweetnacl (avoids crash if dependencies haven't been installed yet)
let nacl = null;
try {
    const naclModule = await import('tweetnacl');
    nacl = naclModule.default || naclModule;
} catch (_) {
    console.warn('[StreamResolver] Notice: tweetnacl package is not installed. Vidlink provider will be unavailable until "npm install tweetnacl" is run.');
}

// In-memory stream cache with 2-hour TTL
const streamCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

// Standard User-Agent for provider requests
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const VIDLINK_KEY = Uint8Array.from(Buffer.from('c75136c5668bbfe65a7ecad431a745db68b5f381555b38d8f6c699449cf11fcd', 'hex'));
const VIDLINK_NONCE = new Uint8Array(24);

function encryptVidlinkToken(mediaId) {
    if (!nacl || !nacl.secretbox) {
        throw new Error('tweetnacl is not available on this server');
    }
    const timestamp = Math.floor(Date.now() / 1000) + 480;
    const mediaIdBuf = Buffer.from(String(mediaId), 'utf-8');
    const timeBuf = Buffer.alloc(8);
    timeBuf.writeBigUInt64BE(BigInt(timestamp));
    const message = Buffer.concat([mediaIdBuf, timeBuf]);
    const encrypted = nacl.secretbox(new Uint8Array(message), VIDLINK_NONCE, VIDLINK_KEY);
    const fullPayload = Buffer.concat([Buffer.from(VIDLINK_NONCE), Buffer.from(encrypted)]);
    return fullPayload.toString('base64url');
}

/**
 * Cache helper
 */
function getCachedStream(key) {
    const entry = streamCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        streamCache.delete(key);
        return null;
    }
    return entry.data;
}

function setCachedStream(key, data) {
    streamCache.set(key, {
        timestamp: Date.now(),
        data,
    });
}

/**
 * Provider 0: VixSrc High-Speed HLS Stream Resolver (1080p FHD, Multi-Audio, Subtitles, Zero Ads)
 */
const VIXSRC_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://vixsrc.to',
    'Origin': 'https://vixsrc.to',
};

async function resolveVixSrc(tmdbId, type = 'movie', season = 1, episode = 1) {
    try {
        const apiUrl = type === 'movie'
            ? `https://vixsrc.to/api/movie/${tmdbId}`
            : `https://vixsrc.to/api/tv/${tmdbId}/${season}/${episode}`;

        const apiRes = await fetch(apiUrl, {
            headers: VIXSRC_HEADERS,
            signal: AbortSignal.timeout(4000),
        });
        if (!apiRes.ok) return null;
        const apiData = await apiRes.json();
        if (!apiData || !apiData.src) return null;

        const embedRes = await fetch(`https://vixsrc.to${apiData.src}`, {
            headers: {
                ...VIXSRC_HEADERS,
                'Accept': 'text/html,application/xhtml+xml,*/*',
            },
            signal: AbortSignal.timeout(4000),
        });
        if (!embedRes.ok) return null;
        const html = await embedRes.text();

        const token = html.match(/token["']\s*:\s*["']([^"']+)/)?.[1];
        const expires = html.match(/expires["']\s*:\s*["']([^"']+)/)?.[1];
        const playlist = html.match(/url\s*:\s*["']([^"']+)/)?.[1];
        if (!token || !expires || !playlist) return null;

        const sep = playlist.includes('?') ? '&' : '?';
        const masterUrl = `${playlist}${sep}token=${token}&expires=${expires}&h=1`;

        // Fetch master playlist to parse qualities and subtitles
        const plRes = await fetch(masterUrl, {
            headers: { ...VIXSRC_HEADERS, Referer: apiUrl },
            signal: AbortSignal.timeout(4000),
        });
        if (!plRes.ok) return null;
        const plText = await plRes.text();

        const qualities = {};
        const variantRegex = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=\d+x(\d+)[^\n]*\n([^\n]+)/g;
        let vMatch;
        let bestRes = '1080p';
        while ((vMatch = variantRegex.exec(plText)) !== null) {
            const resHeight = vMatch[1];
            const vUrl = vMatch[2]?.trim();
            if (resHeight && vUrl) {
                qualities[`${resHeight}p`] = vUrl;
            }
        }
        if (qualities['1080p']) bestRes = '1080p';
        else if (qualities['720p']) bestRes = '720p';
        else if (qualities['480p']) bestRes = '480p';

        const subtitles = [];
        const subRegex = /#EXT-X-MEDIA:TYPE=SUBTITLES[^\n]*NAME="([^"]+)"[^\n]*LANGUAGE="([^"]+)"[^\n]*URI="([^"]+)"/g;
        let sMatch;
        while ((sMatch = subRegex.exec(plText)) !== null) {
            subtitles.push({
                label: sMatch[1] || 'Subtitles',
                srclang: sMatch[2] || 'en',
                url: sMatch[3],
            });
        }

        return {
            provider: 'vixsrc',
            streamUrl: masterUrl,
            qualities: Object.keys(qualities).length > 0 ? qualities : { '1080p': masterUrl },
            type: 'hls',
            quality: bestRes,
            headers: {
                'Referer': 'https://vixsrc.to/',
                'Origin': 'https://vixsrc.to',
            },
            subtitles,
        };
    } catch {
        return null;
    }
}

/**
 * Provider 1: VidLink Encrypted Stream Resolver (High Quality, 1080p, Zero Ads)
 */
async function resolveVidLink(tmdbId, type = 'movie', season = 1, episode = 1) {
    try {
        const token = encryptVidlinkToken(tmdbId);
        const url = type === 'movie'
            ? `https://vidlink.pro/api/b/movie/${token}?multiLang=1`
            : `https://vidlink.pro/api/b/tv/${token}/${season}/${episode}?multiLang=1`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Origin': 'https://vidlink.pro',
                'Referer': 'https://vidlink.pro/',
            },
            signal: AbortSignal.timeout(3500),
        });

        if (!res.ok) return null;
        const data = await res.json();
        if (!data || !data.stream) return null;

        const rawQualities = data.stream.qualities || {};
        const availableQualities = {};
        for (const [resKey, qObj] of Object.entries(rawQualities)) {
            if (qObj?.url) {
                availableQualities[`${resKey}p`] = qObj.url;
            }
        }

        const chosen = rawQualities['1080'] || rawQualities['720'] || rawQualities['480'] || rawQualities['360'];
        const streamUrl = chosen?.url || data.stream.playlist;

        if (streamUrl) {
            const subtitles = Array.isArray(data.stream.captions)
                ? data.stream.captions.map(c => ({
                    label: c.language || 'English',
                    srclang: c.id || 'en',
                    url: c.url,
                }))
                : [];

            return {
                provider: 'vidlink',
                streamUrl,
                qualities: availableQualities,
                type: streamUrl.includes('.m3u8') ? 'hls' : 'mp4',
                quality: chosen ? (chosen === rawQualities['1080'] ? '1080p' : chosen === rawQualities['720'] ? '720p' : chosen === rawQualities['480'] ? '480p' : '360p') : 'auto',
                headers: {},
                subtitles,
            };
        }
    } catch {
        // Fall through
    }
    return null;
}

/**
 * Provider 1: AutoEmbed / MultiEmbed Direct Stream Resolver
 */
async function resolveAutoEmbed(tmdbId, type = 'movie', season = 1, episode = 1) {
    try {
        const url = type === 'movie'
            ? `https://player.autoembed.cc/api/getSource/movie/${tmdbId}`
            : `https://player.autoembed.cc/api/getSource/tv/${tmdbId}/${season}/${episode}`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': 'https://player.autoembed.cc/',
                'Accept': 'application/json, text/plain, */*',
            },
            signal: AbortSignal.timeout(6000),
        });

        if (!res.ok) return null;
        const data = await res.json();

        // Check for direct stream or m3u8 source
        if (data && (data.source || data.stream || data.url)) {
            const streamUrl = data.source || data.stream || data.url;
            const subtitles = Array.isArray(data.subtitles)
                ? data.subtitles.map(s => ({
                    label: s.lang || s.label || 'Unknown',
                    srclang: s.language || s.lang || 'en',
                    url: s.file || s.url,
                }))
                : [];

            return {
                provider: 'autoembed',
                streamUrl,
                type: streamUrl.includes('.m3u8') ? 'hls' : 'mp4',
                quality: 'auto',
                headers: {
                    'Referer': 'https://player.autoembed.cc/',
                    'User-Agent': USER_AGENT,
                },
                subtitles,
            };
        }
    } catch {
        // Fall through to next provider
    }
    return null;
}

/**
 * Provider 2: VidSrc Embed Resolver
 */
async function resolveVidSrc(tmdbId, type = 'movie', season = 1, episode = 1) {
    try {
        const embedUrl = type === 'movie'
            ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
            : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

        const res = await fetch(embedUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': 'https://vidsrc.me/',
            },
            signal: AbortSignal.timeout(6000),
        });

        if (!res.ok) return null;
        const html = await res.text();

        // Extract RCP / player token iframe
        const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i) || html.match(/id=["']player_iframe["'][^>]+src=["']([^"']+)["']/i);
        if (iframeMatch && iframeMatch[1]) {
            let rcpUrl = iframeMatch[1];
            if (rcpUrl.startsWith('//')) rcpUrl = 'https:' + rcpUrl;
            else if (rcpUrl.startsWith('/')) rcpUrl = 'https://vidsrc.me' + rcpUrl;

            // Fetch RCP page
            const rcpRes = await fetch(rcpUrl, {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Referer': embedUrl,
                },
                signal: AbortSignal.timeout(6000),
            });

            if (rcpRes.ok) {
                const rcpHtml = await rcpRes.text();
                // Check for HLS source in script tag
                const hlsMatch = rcpHtml.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/i) ||
                                 rcpHtml.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);

                if (hlsMatch && hlsMatch[1]) {
                    return {
                        provider: 'vidsrc',
                        streamUrl: hlsMatch[1],
                        type: 'hls',
                        quality: '1080p',
                        headers: {
                            'Referer': rcpUrl,
                            'User-Agent': USER_AGENT,
                        },
                        subtitles: [],
                    };
                }
            }
        }
    } catch {
        // Fall through
    }
    return null;
}

/**
 * Provider 3: VidCore / MoviesAPI Resolver
 */
async function resolveVidCore(tmdbId, type = 'movie', season = 1, episode = 1) {
    try {
        const apiUrl = type === 'movie'
            ? `https://moviesapi.to/movie/${tmdbId}`
            : `https://moviesapi.to/tv/${tmdbId}-${season}-${episode}`;

        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': 'https://moviesapi.to/',
            },
            signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
            const html = await res.text();
            const m3u8Match = html.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/i);
            if (m3u8Match && m3u8Match[1]) {
                return {
                    provider: 'vidcore',
                    streamUrl: m3u8Match[1],
                    type: 'hls',
                    quality: 'auto',
                    headers: {
                        'Referer': 'https://moviesapi.to/',
                        'User-Agent': USER_AGENT,
                    },
                    subtitles: [],
                };
            }
        }
    } catch {
        // Fall through
    }
    return null;
}

/**
 * Main Stream Resolver Function
 * Resolves TMDB ID to a direct .m3u8 HLS playlist and subtitle tracks.
 */
export async function resolveStream({ tmdbId, type = 'movie', season = 1, episode = 1, provider = 'auto' }) {
    if (!tmdbId) {
        throw new Error('tmdbId is required');
    }

    const cacheKey = `${type}_${tmdbId}_${season}_${episode}_${provider}`;
    const cached = getCachedStream(cacheKey);
    if (cached) {
        return {
            ...cached,
            cached: true,
        };
    }

    // Configure provider order based on user selection or default auto order
    let providers = [resolveVixSrc, resolveVidLink, resolveAutoEmbed, resolveVidSrc, resolveVidCore];
    if (provider === 'vixsrc') {
        providers = [resolveVixSrc, resolveVidLink, resolveAutoEmbed, resolveVidSrc];
    } else if (provider === 'vidlink') {
        providers = [resolveVidLink, resolveVixSrc, resolveAutoEmbed, resolveVidSrc];
    } else if (provider === 'vidsrc') {
        providers = [resolveVidSrc, resolveVixSrc, resolveVidLink, resolveAutoEmbed];
    } else if (provider === 'autoembed') {
        providers = [resolveAutoEmbed, resolveVixSrc, resolveVidLink, resolveVidSrc];
    }

    for (const resolver of providers) {
        try {
            const result = await resolver(tmdbId, type, season, episode);
            if (result && result.streamUrl) {
                const responseData = {
                    success: true,
                    tmdbId,
                    type,
                    season: type === 'tv' ? season : undefined,
                    episode: type === 'tv' ? episode : undefined,
                    stream: {
                        url: result.streamUrl,
                        type: result.type,
                        quality: result.quality,
                        qualities: result.qualities || {},
                        headers: result.headers || {},
                        provider: result.provider,
                    },
                    subtitles: result.subtitles || [],
                    cached: false,
                };
                setCachedStream(cacheKey, responseData);
                return responseData;
            }
        } catch {
            continue;
        }
    }

    // Direct stream resolution fallback notice
    return {
        success: false,
        fallbackEmbed: false,
        tmdbId,
        type,
        season: type === 'tv' ? season : undefined,
        episode: type === 'tv' ? episode : undefined,
        message: 'Direct stream is currently resolving or unavailable from providers.',
    };
}

/**
 * Stream Proxy Handler for Web Browsers (Bypasses CORS, Range restrictions & CDN throttling)
 */
export async function handleStreamProxy(req, res) {
    const targetUrl = req.query.url;
    const referer = req.query.referer || '';

    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const forwardHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
            'Accept': '*/*',
        };

        // Forward Range header for partial content streaming & smooth seeking
        if (req.headers.range) {
            forwardHeaders['Range'] = req.headers.range;
        }

        // Forward referer if provided or default for vixsrc
        const activeReferer = referer || (targetUrl.includes('vixsrc') || targetUrl.includes('rockycondor') ? 'https://vixsrc.to/' : '');
        if (activeReferer && !activeReferer.includes('vidlink.pro')) {
            forwardHeaders['Referer'] = activeReferer;
            try {
                forwardHeaders['Origin'] = new URL(activeReferer).origin;
            } catch {
                // ignore
            }
        }

        const upstreamRes = await fetch(targetUrl, {
            headers: forwardHeaders,
        });

        const contentType = upstreamRes.headers.get('content-type') || '';
        const isManifest = targetUrl.includes('.m3u8') ||
                           targetUrl.includes('/playlist') ||
                           contentType.includes('mpegurl') ||
                           contentType.includes('application/x-mpegURL');

        // Handle .m3u8 manifest rewriting
        if (isManifest) {
            const manifestText = await upstreamRes.text();
            const baseUrl = new URL(targetUrl);
            const encodedRef = encodeURIComponent(activeReferer || 'https://vixsrc.to/');
            const proxyPath = req.originalUrl ? req.originalUrl.split('?')[0] : (req.baseUrl ? `${req.baseUrl}/stream/proxy` : req.path);

            // Rewrite relative URLs & URI attributes inside the playlist to route through the proxy
            const rewritten = manifestText.split('\n').map(line => {
                let currentLine = line;
                const trimmed = currentLine.trim();
                if (!trimmed) return currentLine;

                // Ensure English audio track is marked DEFAULT=YES, AUTOSELECT=YES
                if (currentLine.startsWith('#EXT-X-MEDIA:TYPE=AUDIO')) {
                    const isEnglish = /LANGUAGE="(eng|en)"|NAME="English"/i.test(currentLine);
                    if (isEnglish) {
                        currentLine = currentLine
                            .replace(/DEFAULT=(YES|NO)/, 'DEFAULT=YES')
                            .replace(/AUTOSELECT=(YES|NO)/, 'AUTOSELECT=YES');
                    } else {
                        currentLine = currentLine
                            .replace(/DEFAULT=(YES|NO)/, 'DEFAULT=NO')
                            .replace(/AUTOSELECT=(YES|NO)/, 'AUTOSELECT=NO');
                    }
                }

                // Rewrite any URI="..." in tags like EXT-X-KEY, EXT-X-MEDIA, EXT-X-MAP
                if (currentLine.includes('URI="')) {
                    currentLine = currentLine.replace(/URI="([^"]+)"/g, (match, uriVal) => {
                        const absUri = new URL(uriVal, baseUrl).href;
                        return `URI="${proxyPath}?url=${encodeURIComponent(absUri)}&referer=${encodedRef}"`;
                    });
                }

                if (trimmed.startsWith('#')) return currentLine;

                // Resolve relative path to absolute
                const absoluteChunkUrl = new URL(trimmed, baseUrl).href;
                const encodedChunk = encodeURIComponent(absoluteChunkUrl);

                return `${proxyPath}?url=${encodedChunk}&referer=${encodedRef}`;
            }).join('\n');

            res.status(upstreamRes.status);
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=30');
            return res.send(rewritten);
        }

        // Set response headers for video streaming (MP4 / TS byte ranges)
        let resContentType = contentType || 'video/mp4';
        if (targetUrl.includes('.ts') || targetUrl.includes('/video/') || targetUrl.includes('/audio/') || targetUrl.includes('0000-')) {
            resContentType = 'video/mp2t';
        } else if (targetUrl.includes('enc.key')) {
            resContentType = 'application/octet-stream';
        }

        res.status(upstreamRes.status);
        res.setHeader('Content-Type', resContentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
        res.setHeader('Accept-Ranges', 'bytes');

        const contentRange = upstreamRes.headers.get('content-range');
        if (contentRange) {
            res.setHeader('Content-Range', contentRange);
        }

        const contentLength = upstreamRes.headers.get('content-length');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        if (upstreamRes.body) {
            Readable.fromWeb(upstreamRes.body).pipe(res);
        } else {
            res.end();
        }
    } catch (err) {
        console.error('Stream proxy error:', err.message);
        if (!res.headersSent) {
            res.status(502).send('Error proxying stream chunk');
        }
    }
}

/**
 * Subtitle Proxy & WebVTT Converter
 * Fetches upstream SRT subtitles, converts to WebVTT format, and returns with CORS headers.
 */
export async function handleSubtitleProxy(req, res) {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const upstreamRes = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'curl/8.7.1',
                'Accept': '*/*',
            },
        });

        if (!upstreamRes.ok) {
            return res.status(upstreamRes.status).send('Upstream subtitle unavailable');
        }

        const srtText = await upstreamRes.text();
        // Convert SRT to WebVTT:
        // Replace CRLF with LF and replace timecode commas (00:00:01,500) with periods (00:00:01.500)
        const vttContent = 'WEBVTT\n\n' + srtText
            .replace(/\r\n|\r/g, '\n')
            .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');

        res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(vttContent);
    } catch (err) {
        console.error('Subtitle proxy error:', err.message);
        if (!res.headersSent) {
            res.status(502).send('Error proxying subtitle');
        }
    }
}
