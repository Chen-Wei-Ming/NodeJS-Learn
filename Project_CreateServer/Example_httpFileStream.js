var http = require('http') ;
var fs = require('fs') ;

var server = http.createServer() ;

var stream = fs.createReadStream('./data/example.json') ;
// var fileStream = fs.readFile('./data/example.json' , function(er , data){
// 	console.log(data) ;
// }) ;

stream.on('data' , function(chunk){
	console.log(chunk) ;
}) ;
stream.on('end' , function(){
	console.log('finished') ;
}) ;

server.on('request' , function(req , res){
	res.writeHead(200 , {'Contetn-Type': 'image/png'}) ;
	fs.createReadStream('./data/image.png').pipe(res) ;
	// res.end('Hello World') ;
}).listen(3000) ;

console.log('Server running at http://localhost:3000') ;