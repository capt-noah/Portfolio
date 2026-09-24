/**
 * Plesk / Phusion Passenger Entrypoint Alias
 * Forwards execution to server.js regardless of whether Plesk is configured
 * with "app.js", "index.js", or "server.js".
 */
import './server.js';
