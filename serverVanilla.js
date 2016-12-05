var request = require('request');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var http = require('http');
var url = require('url');
var fs = require('fs');

// Here is the pure node server.

http.createServer(function(req, res) {
  var path = url.parse(req.url, true).pathname;
  if(req.method === 'GET') {
    if(path === '/skyscanner') {
      var params = url.parse(req.url, true).query;
      var leaveDate = params.leave.slice(0,10);
      var returnDate = params.anytime !== "true" ? (params.return).slice(0,10): "";
      var airport = params.airport;
      var apiCall = `http://api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/${airport}/anywhere/${leaveDate}/${returnDate}?apikey=ma602590217972886030597213906172`;
      request(apiCall,function(error,response,body){
        if(!error && response.statusCode == 200){
          res.writeHead(200,{'Content-Type':'application/json'})
          res.end(body);
        } else{
          res.end("error");
          console.log("ERROR");
        }
      });
    } else if(path === '/'){
      res.writeHead(200,{'Content-Type':'text/html'});
      fs.createReadStream(`${__dirname}/public/index.html`).pipe(res);
    } else if(path === '/style.css'){
      res.writeHead(200,{'Content-Type':'text/css'});
      fs.createReadStream(`${__dirname}/public/style.css`).pipe(res);
    } else if (path === '/favicon.ico') {
      res.writeHead(404);
      res.end();
    } else {
      // Here the only files we have left in public are javascript,
      // and the path variable contains the proper route after /public
      res.writeHead(200,{'Content-Type':'text/javascript'});
      fs.createReadStream(`${__dirname}/public${path}`).pipe(res);
    }
  }
  //We don't have anymore request types, they are all GET requests
}).listen(3030, '127.0.0.1');
console.log('Listening');


//  HERE IS NODE WITH MIDDLEWARE finalhandler AND serve-static
// var serve = serveStatic(__dirname + '/public', {'index': ['index.html']});

// http.createServer(function(req, res) {
//   var path = url.parse(req.url, true).pathname;
//   var done = finalhandler(req, res);
//   if(req.method === 'GET') {
//     if(path === '/skyscanner') {
//         var params = url.parse(req.url, true).query;
//         var leaveDate = params.leave.slice(0,10);
//         var returnDate = params.anytime !== "true" ? (params.return).slice(0,10): "";
//         var airport = params.airport;
//         var apiCall = `http://api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/${airport}/anywhere/${leaveDate}/${returnDate}?apikey=ma883234862726692043253436706997`;
//         request(apiCall,function(error,response,body){
//           if(!error && response.statusCode == 200){
//             res.writeHead(200,{'Content-Type':'application/json'})
//             res.end(body);
//           } else{
//             res.end("error");
//             console.log("ERROR");
//           }
//         });
//     } else {
//       //Here is where the Middleware comes in.
//       serve(req, res, done);
//     }
//   }
//   //We don't have anymore request types, they are all GET requests
// }).listen(3030, '127.0.0.1');
// console.log('Listening');
