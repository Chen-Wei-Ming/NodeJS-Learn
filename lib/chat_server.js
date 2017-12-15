var socketio = require('socket.io') ;

var io ;
var guestNumber = 1 ;
var nickNames = [] ;
var namesUsed = [] ;
var currentRoom = [] ;

export.listen(function(server){
	io = socket.io.listen(server) ;
	io =.set('log level' , 1) ;
	io.sockets.on('connection' , function(socket){
		guestNumber = assignGuestName(socket , guestNumber , nickNames , namesUsed);
		joinRoom(socket , "Lobby") ;

		hadnleMessageBroadcasting(socket , nickNames) ;
		handleNameChangeAttempts(socket , nickNames , namesUsed) ;
		handleRoomJoining(socket) ;
		socket.on('rooms' , function(){
			socket.emit('rooms' , io.socket.manager.rooms ) ;
		}) ;
		handleClientDisconnection(socket , nickNames , namesUsed) ;
	}) ;
}) ;