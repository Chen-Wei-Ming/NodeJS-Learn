var socketio = require('socket.io') ;

var io ;
var guestNumber = 1 ;
var nickNames = [] ;
var namesUsed = [] ;
var currentRoom = [] ;

export.listen(function(server){
	io = socket.io.listen(server) ;
	io.set('log level' , 1) ;
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

// 新增訪問者資訊
function assignGuestName(socket , guestNumber , nickNames , namesUsed){
	var name = 'Guest'+guestNumber; // 預設名稱 Guest1、Guest2 ...
	nickNames[socket.id] = name ; // nickName為Array，依據socketID作為index
	socket.emit('nameResult',{ //發送訊息 name
		success: true,
		name: name // 變數 與 數值
	});
	namesUsed.push(name) ; // 將name紀錄，避免重複
	return guestNumber + 1 ; // Number會累加
}

function joinRoom(socket , room){
	socket.join(room) ; // room 會指定要加入的Room
	currentRoom[socket.id] = room ; // --- 待確認
	socket.emit('joinResult' , {room : room}) ; // 發送訊息 room
	socket.broadcast.to(room).emit('message' , {
		// 說明目前 guest name 加入 room
		text: nickNames[socket.id] + 'has joined '+ room +'.'
	});

	var userInRoom = io.socket.clients(room) ;
	if(userInRoom.length > 1){
		var usersInRoomSummary = 'Users currently in ' + room + ':' ;
		for(var index in userInRoom){
			var userSocketId = userInRoom[index].id ;
			if(userSocketId != socket.id){
				usersInRoomSummary += ', ' ;
				usersInRoomSummary += nickNames[userSocketId] ;
			}
		}
		usersInRoomSummary += '.' ;
		socket.emit('message' , {text:usersInRoomSummary}) ;
	}
}
function handleNameChangeAttempts(socket , nickNames , namesUsed){
	socket.on('nameAttempt' , function(name){
		if(name.indexOf('Guest') == 0){
			socket.emit('nameResult' ,{
				success:false ,
				message:'Name cannot begin with "Guest".'
			}) ;
		}else{
			if(namesUsed.indexOf(name) == -1){
				var previousName = nickNames[socket.id] ;
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name) ;
				delete namesUsed[previousNameIndex] ;
				socket.emit('nameResult' , {
					success :true,
					name :name});
				socket.broadcast.to(currentRoom[socket.id]).emit('message' ,{
					text:previouseName + 'is now knows as'+name+'.'
				});
			}else{
				socket.emit('nameResult' ,{
					success:false,
					message:'That name is already in use.'
				});
			}
		}
	});
}
function handleMessageBroadcasting(socket){
	socket.on('message' , function(message){
		socket.broadcast.to(message.room).emit('message' ,{
			text:nickNames[socket.id] +': '+message.text
		});
	});
}
function handleRoomJoining(socket){
	socket.on('join' , function(room){
		socket.leave(currentRoom[socket.id]) ;
		joinRoom(socket , room.newRoom) ;
	})
}
function handleClientDisconnection(socket){
	socket.on('disconnect' , function(){
		var nameIndex - namesUsed.indexOf(nickNames[socket.id]) ;
		delete namesUsed[nameIndex] ;
		delete nickNames[socket.id] ;
	});
}


var socket = io.connect();
$(document).ready(function(){
	var chatApp = new Chat(socket) ;
	socket.on('nameResult' , function(result){
		var message ;
		if(result.success){
			message = 'You are now know as '+ result.name + '.' ;
		}else{
			message = result.message ;
		}
		$('#messages').append*divSystemContentElement(message) ;
	}) ;

	socket.on('joinResult' , function(result){
		$('#room').text(result.room) ;
		$('#messages').apppend(divSystemContentElement('Room chaged .')) ;
	});

	socket.on('message' , function(message){
		var newElement = $('<div></div>').text(message.text) ;
		$('#message').append(newElement) ;
	});

	socket.on('rooms' , function(rooms){
		$('#room-list').empty() ;
		for(var room in rooms){
			room = room.substring(1 , room.length) ;
			if(room != ''){
				$('#room-list').append(divSystemContentElement(room)) ;
			}
		}
		$('#room-list div').click(function(){
			chatApp.processCommand('/join' + $(this).text()) ;
			$('#send-message').focus() ;
		});
	});
	setInterval(function(){
		socket.emit('rooms') ;
	} , 1000);

	$('#send-message').focus();

	$('#send-form').submit(function(){
		processUserInput(chatApp , socket) ;
		return false ;
	})
});