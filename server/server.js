const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;


app.use('/', express.static(path.resolve(__dirname, '../client/containers/source.gif')))
//db connection
//body parser
app.use(bodyParser.json());

//defining route handler to apiRouter
app.use('/api', apiRouter);

// Catch all route handler
app.use((req, res) => res.sendStatus(404));

// Create event listener for socket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('code change', (val) => {
    // Sends to all clients except sender
    io.sockets.emit('receive code', val);
  })
});

io.on('disconnect', () => {
  console.log('user disconnected')
});

//Start server
module.exports = http.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
