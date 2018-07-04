var http = require('http') ;
var fs = require('fs') ;
var path = require('path') ;
var mime = require('mime') ;

var cache = {} ;

function send404(response){
	response.writeHead(404 , {'Contetn-Type' : 'text/plain'}) ;
	response.write('Error 404 : resource not found') ; // 顯示在頁面上
	response.end() ; // 關閉
}

// 依據檔案格式，顯示頁面
function sendFile(response , filePath , fileContents){
	response.writeHead(200 ,
		{'Contetn-Type' : mime.getType(path.basename(filePath))}
		// getType return text/plain
	);
	response.end(fileContents) ; // end(var)，顯示在畫面之上
}

function serverStatic(response , cahce , absPath){
	if(cache[absPath]){ // 讀取index.html
		sendFile(response , absPath , cache[absPath]) ;
	}else{ // cashe 有無資料，第一次載入不在cashe中
		fs.exists(absPath , function(exists){ // 判斷檔案是否存在
			if(exists){ // 檔案存在
				fs.readFile(absPath , function(err , data){
					if(err){ // 讀取失敗
						send404(response) ;
					}else{ // 讀取成功
						cahce[absPath] = data ; // 記錄在cache中
						sendFile(response , absPath , data) ; // 顯示檔案內容
					}
				}) ;
			}else{
				send404(response) ;
			}
		}) ;
	}
}

var server = http.createServer(function(request , response){
	var filePath = false ; // 沒有預設的檔案路徑
	if(request.url == '/'){
		filePath = 'public/index.html' ;
	}else{
		filePath = 'public' + request.url ;
	}
	var absPath = './' + filePath ; // 指定相對路徑
	serverStatic(response , cache , absPath) ; // Server啟動重點：路徑與檔案
}) ;

server.listen(3000 , function(){ // 設定Server Port Number
	console.log('Server running at http://localhost:3000') ;
}) ;
