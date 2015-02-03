var express = require('express'), user = require('./routes/users.js');
 
var app = express();

var port_num = 3333

app.configure(function () {
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
}); 
 
app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addUser);
app.put('/users/:id', user.deleteUser);
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