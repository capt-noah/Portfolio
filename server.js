const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// 1. Zero-dependency sanity test
app.get('/hello', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Plain JavaScript Express server is running on Plesk!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: process.env.PORT || 3000
  });
});

// 2. Serve React static files if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 3. Catch-all fallback for React SPA
app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Express is running! Build React frontend to see the UI.');
  }
});

// 4. Passenger binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
