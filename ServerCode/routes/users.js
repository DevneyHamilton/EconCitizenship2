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
        db.collection('vendors', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'vendors' collection doesn't exist. Creating it with sample data...");
                populateDbWithVendorCollection();
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
                    score = calculateUserScore(user["transactions"], vendors[0])
                    res_str = user_name + " has the following score: " + score;
                    
                    console.log(res_str);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(res_str);
                });
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

/*takes in a user transactions object, and a vendor info object, and outputs a score*/
var calculateUserScore = function(user_transactions, vendor_info){
    //dummy
    transaction_score = 0;
    for(var i = 0; i < user_transactions.length; i++){
        transaction = user_transactions[i]
        vendor_rating = vendor_info[transaction["vendor"]]
        //if 'good'
        //replace with a map from rating to multipler or score function!
        if(vendor_rating == 1){
            transaction_score += transaction["amount"] * .2
        }else if(vendor_rating == 2){
            transaction_score += transaction["amount"] * .05
        }
        

    }
    return transaction_score

}

/*should be refactored so only one method for both users and vendors collections!

be able to look up a rating based on the name of a vendor, and 
get all vendors as a list as the keys of this map. Start with two 
ratings: 1 is 'good' and 2 is 'bad.' This can later be expanded
to have more attributes per vendor (e.g. category, local vs franchise) 
by mapping from name to an object or from name to an array of properties identifiable by index*/
var populateDbWithVendorCollection = function(){
    var vendors = {
        "McKameys" : 1, 
        "Vocal & Local" : 1,
        "Mercadito": 1,
        "LexCorp" : 2,
        "Buy n Large" : 2,
        "Veidt Industries" : 2
    }
    db.collection('vendors', function(err, collection) {
        collection.insert(vendors, {safe:true}, function(err, result) {});
    });


}




var populateDB = function() {

    var users = [
    {
            name: "A",
            county: "Santa Clara",
            transactions:[
                { vendor: "McKameys",
                    amount: 11

                },
                { vendor: "LexCorp",
                    amount:20

                },
                { vendor: "Vocal & Local",
                  amount: 13 
                }   
            ],
            bank: "One United Bank",
            credit_score: 600,
            donations:20,
            volunteer_hours: 10 
    },
    {
        name: "B",
        county: "San Mateo",
        transactions:[
                { vendor: "Mercadito",
                    amount: 31

                },
                { vendor: "Veidt Industries",
                    amount:18

                },
                { vendor: "Vocal & Local",
                  amount: 6
                }   
            ],
        bank: "Chase",
        credit_score: 420,
        donations:10,
        volunteer_hours: 23
    },
    {
        name: "C",
        county: "San Mateo",
        transactions:[
                { vendor: "McKameys",
                    amount: 20

                }   
            ],
        bank: "Self Help Credit Union",
        credit_score: 530,
        donations:100,
        volunteer_hours: 5
    },
    {
        name: "D",
        county: "Alameda",
        transactions:[
                { vendor: "Buy n Large",
                    amount: 23

                },
                { vendor: "LexCorp",
                    amount:15

                },
                { vendor: "McKameys",
                  amount: 7 
                }   
            ],
        bank: "Beneficial Bank",
        credit_score: 570,
        donations: 40,
        volunteer_hours: 8
    }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};