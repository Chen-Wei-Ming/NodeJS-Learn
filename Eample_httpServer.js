var http = require('http') ;

var server = http.createServer() ;

server.on('request' , function(req , res){
	res.writeHead(200 , {'Contetn-Type': 'text/plain'}) ;
	res.end('Hello World') ;
}).listen(3000) ;

console.log('Server running at http://localhost:3000') ;