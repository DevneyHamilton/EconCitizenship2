(function($){   
    var User = Backbone.Model.extend({
        defaults: {
            name: "unknown",
            county: "Santa Clara"
        }
    });

    var Users = Backbone.Collection.extend({
        model:User,
        url : "http://127.0.0.1:3333/users/",
        initialize: function(){
            this.bind("reset", this.value_change);

        },
        value_change: function(){
            alert("users fetched");
        }

    });


  

    var UserListView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click button#add': 'addUser'
        },
        initialize:function(){
            _.bindAll(this, 'render', 'addUser', 'appendUser');
            this.collection = new Users();
            this.collection.bind('add', this.appendUser);
            console.log("try fetching in view init");
            this.collection.fetch();
            this.counter = 0; // total number of users added thus far
            this.render();
        },
        
        render:function(){
            $(this.el).append("<button id='add'>Add  user</button>");
            $(this.el).append("<button id='load_all'>Get all</button>");
            $(this.el).append("<ul></ul>");
            _(this.collection.models).each(function(user){
                self.appendUser(user);
            }, this);
        },
        // saveTest: function(){
        //     var test_user = new User({"name": "F", "county" : "Alameda"});
        //     console.log("try save");
        //     test_user.save({
        //         success: function(){
        //             console.log("saved!!!")
        //         },
        //         error: function(){
        //             console.log("failed to save :((((")
        //         }
        //     });


        // },
        addUser: function(){
            this.counter++;
            var user = new User();
            user.set({
                county: user.get('county') + this.counter
            });
            this.collection.add(user);
        },

        appendUser: function(user){
            $('ul', this.el).append("<li>"+user.get('name') + " " + user.get('county') + "</li>")
        }
    });

    var userListView = new UserListView();



})(jQuery);