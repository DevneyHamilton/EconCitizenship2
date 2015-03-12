var mongo = require('mongodb');
var _und = require("underscore-node");
var categoriesModule = require('../../scripts/categoriesModule.js');
var myCategories = categoriesModule.getCategories(); //hacky - fix the module!

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
            res.header("Access-Control-Allow-Origin", "*");
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
                res.header("Access-Control-Allow-Origin", "*");
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.header("Access-Control-Allow-Origin", "*");
                res.send(result[0]);
            }
        });
    });
}

exports.updateUser = function(req, res) {
    console.log("in update user")
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        //attempt to deal with id problem:
        delete user["_id"];
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
/*getScore needs fixing: should be able to get vendor, banking and all other backend info 
from outside a request*/
exports.getScore = function(req,res){
    console.log("getting score")
    db.collection('vendors', function(err, vendorCollection) {
        vendorCollection.find().toArray(function(err, vendors) {
            console.log(JSON.stringify(vendors));
            res.header("Access-Control-Allow-Origin", "*");
            db.collection('users', function(err, userCollection){
                //will need to replace with findAndModify
                var id = req.params.id;
                userCollection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
                    user_name = user["name"];
                    user_transactions = JSON.stringify(user["transactions"]);
                    score = calculateUserScore(user, vendors[0])
                    console.log("in getScore: " + score)
                    var res_str = score; //make sure it's a string
                    
                    console.log("score is :" + res_str);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(res_str);
                });
            });
        });
    });
    
}

exports.saveData = function(req, res){
   var user_id = req.params.id;
   console.log("saving data for user with id " + user_id + " and data: " + JSON.stringify(req.body));
   db.collection('users', function(err, userCollection){
        //will need to replace with findAndModify
        var id = req.params.id;
        userCollection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
            var user_name = user["name"];
            var old_data = user["data"];
            console.log("old data: " + JSON.stringify(old_data))
            //assumes only one category sent in request
            var cat_name = Object.keys(req.body);
            old_data[cat_name] = req.body[cat_name]; //insert new value for this input key
            console.log("found user with name: " + user_name + " " + JSON.stringify(old_data));
            //attempt to deal with id problem:
            delete user["_id"];
            user["data"] = old_data; //updated
            console.log(JSON.stringify(user));
            userCollection.update({'_id':new BSON.ObjectID(user_id)}, user, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating user: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    //send back category score
                    

                    
                    console.log('' + result + ' document(s) updated');
                    res.send(user);
                }
            });
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

/*takes in a user object, and a vendor info object, and outputs a score*/
var calculateUserScore = function(user_info, vendor_info){
    console.log("user data in score fn: " + JSON.stringify(user_info["data"]));
    var scoreFun = categoriesModule.ScoringFunction;
    var score = scoreFun(user_info["data"], myCategories);
    return score;
}


var populateDB = function() {

    var users = [
    {
            name: "A",
            county: "Santa Clara",
            data:{},
    },
    {
        name: "B",
        county: "San Mateo",
        data:{},
    },
    {
        name: "C",
        county: "San Mateo",
        data:{},
    },
    {
        name: "D",
        county: "Alameda",
        data:{},
    }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};