const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var player1Join=false;
var player2Join=false;
var player1id="";
var player2id="";
io.on('connection', (socket) => {
  var thisplayer="";
  var handshake = socket.handshake;
  console.log(handshake.address+' connected');

  if(!player1Join){
    thisplayer="player1";
    console.log(handshake.address+' is '+thisplayer);
    player1id=socket.id;
    player1Join=true;

    io.to(player1id).emit('join', "player1");
    if(player1Join && player2Join) io.emit('start', "");
  } else if(!player2Join){
    thisplayer="player2";
    console.log(handshake.address+' is '+thisplayer);
    player2id=socket.id;
    player2Join=true;

    io.to(player2id).emit('join', "player2");
    if(player1Join && player2Join) io.emit('start', "");
  } 
  else socket.disconnect();

  socket.on('paddleAPos', msg => {
    io.to(player2id).emit('paddleAPos',msg);
  });
  socket.on('paddleBPos', msg => {
    io.to(player1id).emit('paddleBPos',msg);
  });
  socket.on('resetPoint', msg => {
    io.emit('resetPoint',"");
  });

  socket.on('color', msg => {
    var color = Math.floor(Math.random() * 3);
    console.log(color);
    io.emit('color',color);
  });

  socket.on('disconnect', () => {
    io.emit('pause', "");
    if(thisplayer=="player1") player1Join = false;
    else player2Join=false;
    console.log(thisplayer+' disconnected');
  });

});

http.listen(port, () => {
  console.log(`3cPingPong server running at port:${port}`);
});