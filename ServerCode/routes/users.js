var mongo = require('mongodb');

var Server = mongo.Server, Db = mongo.Db, BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('EconCitDbV2', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'EconCitDb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});




exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
}


exports.findAll = function(req, res) {
    console.log("finding all");
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(items);
        });
    });
};



exports.addUser = function(req, res) {
    var user = req.body
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
} 


var populateDB = function() {

    var users = [
    {
        name: "A",
        county: "Santa Clara",
        giving_data: {
            donations: 20, 
            volunteer_hours: 10
        },
        banking_data:{
            credit_score: 600,
            bank: "One United Bank"
        },
        spending_data:{}
    },
    {
        name: "B",
        county: "San Mateo",
        giving_data: {
            donations: 50, 
            volunteer_hours:2
        },
        banking_data:{
            credit_score: 400,
            bank: "none"
        },
        spending_data:{}
    }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};