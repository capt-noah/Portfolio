/**
 * NotFlix Standalone Node.js Express Server
 * Serves the NotFlix API (TMDB proxy, HLS stream resolver, CORS proxy)
 * and hosts the production React frontend build if dist/ exists.
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import notflixRouter from './router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup (graceful if package not installed)
let corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
};
try {
    const corsModule = await import('cors');
    corsMiddleware = (corsModule.default || corsModule)();
} catch (_) {}

app.use(corsMiddleware);
app.use(express.json());

// Global Rate Limiting (graceful if package not installed)
try {
    const rlModule = await import('express-rate-limit');
    const rateLimit = rlModule.default || rlModule;
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: process.env.NODE_ENV === 'production' ? 1000 : 5000,
        message: { error: 'Too many requests, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(['/api/', '/notflix/api/'], limiter);
} catch (_) {}

// Top-level Health Checks
app.get(['/health', '/api/health', '/notflix/health', '/notflix/api/health'], (req, res) => {
    res.json({
        status: 'ok',
        app: 'NOTFLIX',
        timestamp: new Date().toISOString(),
        port: PORT,
        frontendMounted: fs.existsSync(path.join(distPath, 'index.html')),
    });
});

// Mount NotFlix Router on both /api and /notflix/api for seamless compatibility
app.use('/notflix/api', notflixRouter);
app.use('/api', notflixRouter);

// ==============================================================================
// STATIC ASSETS & SPA ROUTING (When running bundled in production / Plesk)
// ==============================================================================
if (fs.existsSync(distPath)) {
    // Serve static dist at root and at /notflix
    app.use(express.static(distPath));
    app.use('/notflix', express.static(distPath));

    // Fallback for /notflix/* subpath
    app.get(['/notflix', '/notflix/*'], (req, res, next) => {
        if (req.path.startsWith('/notflix/api')) return next();
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }
        res.status(404).send('NotFlix frontend not found.');
    });

    // Root SPA Fallback
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }
        res.status(200).send('NotFlix API server is running.');
    });
}

// Start Server if run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✓ NotFlix Server running on http://localhost:${PORT}`);
        console.log(`  - API Base:     http://localhost:${PORT}/api`);
        console.log(`  - Plesk Path:   http://localhost:${PORT}/notflix/api`);
        console.log(`  - Stream Route: http://localhost:${PORT}/api/stream?tmdbId=550&type=movie`);
    });
}

export default app;