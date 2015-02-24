var express = require('express'), user = require('./routes/users.js');
 
var app = express();


var port_num = 3000

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
  console.log(__dirname);
  app.use(express.static(__dirname + "/../web"));
	app.use(allowCrossDomain);
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
}); 
 
app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addUser);
/*app.post('/getScore/:id', function(req, resp){
  console.log("getting score");
  resp.send("33");

});*/
app.post('/getScore/:id', user.getScore);
app.put('/users/:id', user.updateUser);
app.delete('/users/:id',user.deleteUser);

//troubleshooting
/*app.post('/users', function (req, res) {
  res.send('POST request to the homepage/users\n')
});*/

app.delete('/', function (req, res) {
  res.send('DELETE request to the homepage\n')
});

app.put('/', function (req, res) {
  res.send('PUT request to the homepage\n')
});


//end troubleshooting
app.listen(port_num);
console.log('herrow, Listening on port ' + port_num);