(function($){   
    var User = Backbone.Model.extend({
        defaults: {
            name: "unknown",
            county: "Santa Clara",
            spending:[],
            bank: "unknown",
            credit_score:0,
            donations:0,
            volunteer_hours: 0 
        },
        url : function() {
            return this.id ? 'http://127.0.0.1:3333/users/' + this.id : 'http://127.0.0.1:3333/users';
        } 
    });

    var Users = Backbone.Collection.extend({
        model: User,
        url : "http://127.0.0.1:3333/users/",
        initialize: function(){
            this.bind("reset", this.value_change);

        },
        value_change: function(){
            alert("users fetched");
        }
    });

    var UserView = Backbone.View.extend({
        //model: User,
        el: $('#user-container'), 
        //add event for saving info
        initialize:function(){
            //alert("init user view");
            _.bindAll(this, 'render');
            this.render();
        },
        render:function(){
            //alert("rendering user view")
            //var tpl = _.template("single user view as template for " +  this.model.id);
            var user_info = {template_id : this.model.id, 
                            template_name: this.model.get("name"),
                            template_bank: this.model.get("bank"),
                            template_county: this.model.get("county"),
                            template_credit_score: this.model.get("credit_score"),
                            template_donations: this.model.get("donations"),
                            template_volunteer_hours: this.model.get("volunteer_hours")
                        }
            alert(JSON.stringify(user_info));              
            var test_tpl = _.template('<p> This user has id <%= template_id%>! \
                  This user has name <%= template_name%>!\
                  This user has bank <%= template_bank%>!\
                  This user has county <%= template_county%>!\
                  This user has credit_score <%= template_credit_score%>!\
                  This user has donations <%= template_donations%>!\
                  This user has volunteer_hours <%= template_volunteer_hours%>!\
                  now on multiple code lines!</p>');
            var tpl = _.template('<div role="tabpanel"> \
                    <!-- Nav tabs -->\
                    <ul class="nav nav-tabs" role="tablist">\
      <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>\
      <li role="presentation"><a href="#giving" aria-controls="My Giving" role="tab" data-toggle="tab">My Giving</a></li>\
      <li role="presentation"><a href="#spending" aria-controls="My Spending" role="tab" data-toggle="tab">My Spending</a></li>\
      <li role="presentation"><a href="#banking" aria-controls="My Banking" role="tab" data-toggle="tab">My Banking</a></li>\
    </ul>\
    <!-- Tab panes -->\
    <div class="tab-content">\
      <div role="tabpanel" class="tab-pane active" id="home">\
        <div class="container">\
          <h1>Tell Us About Who You Are . . .. </h1>\
            <div style="padding: 100px 100px 10px;">\
              <form class="user-input-form" role="form">\
                <div class="input-group">\
                   <span class="input-group-addon">My name is </span>\
                   <input type="text" class="form-control" placeholder="" id="input-name" value="<%= template_name%>">\
                   \
                </div>\
                <div class="input-group">\
                   <span class="input-group-addon">I live in </span>\
                   <input type="text" class="form-control" placeholder="" id="input-county" value="">\
                   <span class="input-group-addon"> County.</span>\
                </div> \
                <button type="submit" class="btn btn-default" id="user-info">Submit</button>\
              </form>\
            </div>\
          </div>\
        </div>\
      <div role="tabpanel" class="tab-pane" id="giving">\
        <div class="container">\
          <h1>Tell Us About Your Giving . . . </h1>\
            <div style="padding: 100px 100px 10px;">\
              <form class="user-input-form" role="form">\
                <div class="input-group">\
                   <span class="input-group-addon">I gave $</span>\
                   <input type="text" class="form-control" placeholder="" id="input-donations">\
                   <span class="input-group-addon">.00 to charity</span> \
                </div>\
                <div class="input-group">\
                   <span class="input-group-addon">I volunteered </span>\
                   <input type="text" class="form-control" placeholder="" id="input-volunteer" value="">\
                   <span class="input-group-addon"> hours in my community.</span>\
                </div>\
                <button type="submit" class="btn btn-default">Submit</button>\
              </form>\
            </div>\
          </div>\
        </div>\
       </div>\
    <div role="tabpanel" class="tab-panel" id="spending"></div>\
      <div role="tabpanel" class="tab-panel" id="banking"></div>\
 </div>')
            html_string = tpl(user_info);
            $(this.el).append(html_string);
        }

    });
    
    var user = new User({id: "54d6ee9d83ba2d2633607458"})
    user.fetch({
        success : function(model, response){
            alert(JSON.stringify(model.get("name")));
            var user_view = new UserView({model: model});

        }
    });
    
   
  

    


})(jQuery);