var express = require('express');
var path = require('path');
var request = require('request');
var app = express();
var port = process.env.PORT || 3030;
app.use(express.static(__dirname + '/public'));

// var defaultCorsHeaders = {
//   "access-control-allow-origin": "*",
//   "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "access-control-allow-headers": "content-type, accept",
//   "access-control-max-age": 30 // Seconds.
// };

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/skyscanner', function(req, res){
  var leaveDate = (req.query.leave).slice(0,10);
  var returnDate = req.query.anytime !== "true" ? (req.query.return).slice(0,10): "";
  var airport = req.query.airport;
  var url = 'http://api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/'+airport+'/anywhere/'+leaveDate+'/' +returnDate+'?apikey=ma602590217972886030597213906172';
  request(url,function(error,response,body){
    if(!error && response.statusCode == 200){
      console.log("Got something from api to server");
      res.end(body);
    }
    else{
      res.end("error");
      console.log("ERROR");
    }
  });
})

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
