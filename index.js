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
  } else if(!player2Join){
    thisplayer="player2";
    console.log(handshake.address+' is '+thisplayer);
    player2id=socket.id;
    player2Join=true;

    io.to(player2id).emit('join', "player2");
  } 
  else socket.disconnect();
    
  socket.on('movePaddle', msg => {
    if(thisplayer=="player1"){
      io.emit('player1', msg);
    }else{
      io.emit('player2', msg);
    } 
  });

  socket.on('ballx', msg => {
    io.emit('ballx', msg);
  });
  socket.on('bally', msg => {
    io.emit('bally', msg);
  });

  socket.on('ballout', msg => {
    io.emit('ballout', msg);
  });

  socket.on('disconnect', () => {
    if(thisplayer=="player1") player1Join = false;
    else player2Join=false;
    console.log(thisplayer+' disconnected');
  });

});

http.listen(port, () => {
  console.log(`3cPingPong server running at port:${port}`);
});