const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(path.join(__dirname, 'dist/my-app')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-app', 'index.html'));
});

const server = http.createServer(app);

const port = process.env.PORT || 4200;
app.set('port', port);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
