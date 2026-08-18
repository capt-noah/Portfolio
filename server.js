import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// 1. Health check route
app.get('/hello', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ESM Express server is running on Plesk!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: process.env.PORT || 3000
  });
});

// 2. Static Vite assets
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 3. React SPA Fallback
app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Express ESM server is active. Build React frontend to view UI.');
  }
});

// 4. Passenger dynamic port binding
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
