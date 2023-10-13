const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

// Disable the host header check
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist/my-app')));

// Catch-all route to serve the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-app', 'index.html'));
});

// Create an HTTP server to listen to requests
const server = http.createServer(app);

// Set the port for the server
const port = process.env.PORT || 4200;
app.set('port', port);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
