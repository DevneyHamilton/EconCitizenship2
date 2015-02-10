var UserListView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click button#add': 'addUser',
            'click button#save_test': 'saveTest'
        },
        initialize:function(){
            _.bindAll(this, 'render', 'addUser', 'appendUser', 'saveTest'); //this is the UserListView for all of these functions
            this.collection = new Users();
            this.collection.bind('add', this.appendUser);
            console.log("try fetching in view init");
            this.collection.fetch();
            this.counter = 0; // total number of users added thus far
            this.render();
        },
        
        render:function(){
            $(this.el).append("<button id='add'>Add  user</button>");
            $(this.el).append("<button id='save_test'>Test Save</button>");
            $(this.el).append("<ul id=user_list></ul>");
            _(this.collection.models).each(function(user){
                self.appendUser(user);
            }, this);
        },
        saveTest: function(){
            var name = $("#input-name").val();
            var county = $("#input-county").val();
            var user_info = {"name": name, "county" : county};
            console.log(user_info)
            var test_user = new User(user_info);
            console.log("try save");
            test_user.save({
                success: function(){
                    console.log("saved!!!") //this isn't happening but server says 'success'
                },
                error: function(){
                    console.log("failed to save :((((")
                }
            });


        },
        addUser: function(){
            this.counter++;
            var user = new User();
            user.set({
                county: user.get('county') + this.counter
            });
            this.collection.add(user);
        },

        appendUser: function(user){
            $('#user_list', this.el).append("<li>"+user.get('name') + " " + user.get('county') + "</li>")
        }
    });

    var userListView = new UserListView();
