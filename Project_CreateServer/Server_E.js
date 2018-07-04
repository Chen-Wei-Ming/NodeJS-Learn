const express = require('express') ;
const app = express() ;

app.get('/' , function(req , res){
	res.send('Express is excellent') ;
}) ;

app.get('/about' , function(req , res){
	res.send('Send about page!') ;
}) ;

app.listen(8888 , function(){
	console.log('start server') ;
}) ;
