const net = require("net");
const http = require("http") ;

var httpServer = http.createServer() ;
httpServer.on('request' , function(req , res){
    res.writeHead(200 , {'Contetn-Type': 'text/plain'}) ;
    res.end('Hello World111') ;
}).listen(3000) ;

// Create a simple server
var netServer = net.createServer(function (conn) {
    console.log("Server: Client connected");

    // If connection is closed
    conn.on("end", function() {
        console.log('Server: Client disconnected');
        // Close the server
        // server.close();
        // End the process
        // process.exit(0);
    });

    // Handle data from client
    conn.on("data", function(data) {
        data = JSON.parse(data);
        console.log("Response from client: %s", data.response);
    });

    // Let's response with a hello message
    conn.write(
        JSON.stringify(
            { response: "Hey there client!" }
        )
    );
});

// Listen for connections
netServer.listen(61337, "140.113.73.213" , function () {
    console.log("Server: Listening");
});