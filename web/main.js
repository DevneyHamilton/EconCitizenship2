(function($){ 
    //var url_base = "http://ec2-54-67-45-196.us-west-1.compute.amazonaws.com/";
    var url_base = "http://localhost:3000/";

    var Category = Backbone.Model.extend({
      user: "unknown" //try adding a user model as an attribute?
      //takes a category object so far, from loaded categories.js. This can/should change in future

    });

    var CategoryView = Backbone.View.extend({
      model: Category,
      initialize: function(){
        console.log("initing view for category: " + this.model.get("name"));
        console.log(". . . for user: " + this.model.get("user").get("name"));
        _.bindAll(this, 'render', 'saveCategoryInfo');
        this.render();
      },
      //next: try to only make the template once
      render:function(){
        tab_info = {"tab_title": this.model.get("name"), "display_name" : this.model.get("displayName") }
        tab_nav_basic_template = _.template(myTemplates['tab_nav_basic']);
        tab_pane_basic_template = _.template(myTemplates['tab_pane_basic']);
        $('.nav-tabs').append(tab_nav_basic_template(tab_info));
        $('.tab-content').append(tab_pane_basic_template(tab_info));
        //handle inputs:
        console.log(this.model.get("inputs"));
        var input_key = Object.keys(this.model.get("inputs"))[0]; //just get first for now
        console.log("input key in render: " + input_key)
        var input_info = {"tab_title": this.model.get("name"),"input_key" : input_key, "input_value": this.model.get("inputs")[input_key] };
        var selector = "#" + this.model.get("name") + " .user-input-form"
        var input_template = _.template(myTemplates['input_basic']);
        $(selector).prepend(input_template(input_info));
        var button_selector = "#" + this.model.get("name") + "_save_button"; //has to match buttton id in template
        //bind the save button
        $(button_selector).click(this.saveCategoryInfo);
      },

      
      saveCategoryInfo : function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        var user_model = this.model.get("user");
        var cat_name = this.model.get("name");
        var inputs = this.model.get("inputs");
        var cat_info ={}; 
        //handle one input - then put this into foreach over inputs, put each one into cat_info
        var input_key = Object.keys(inputs)[0]

        var input_selector = '#' + input_key + "_input"; //has to match input id in template
        var input_value = $(input_selector).val()
        cat_info[input_key] = input_value; //needs some validation
        console.log([input_key, input_selector, input_value])
        console.log("user id:" + user_model.get("_id") + " saving " + cat_name + " " + JSON.stringify(cat_info));
        console.log("event happened! target: " + e.target.id + " for user " + user_model.get("name"));
        save_data_url_base =  url_base + "saveData/";
        save_data_url = save_data_url_base + user_model.get("_id");
        var data_to_send = {};
        data_to_send[cat_name] = cat_info;
        console.log(save_data_url)
        $.ajax(save_data_url, {
            type: "POST",
            dataType: "json",
            data: data_to_send,
            success: function(response){
                console.log(response)

            }

        });
      }

    });

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
            return this.id ? url_base + 'users/' + this.id : url_base + 'users';
        } 
    });

    //TODO: We do NOT want to load all the users! Need to fix this when deving login
    var Users = Backbone.Collection.extend({
        model: User,
        url : url_base + "users/",
        initialize: function(){
            this.bind("reset", this.value_change);

        },
        value_change: function(){
            console.log("users fetched");
        }
    });

    var UserView = Backbone.View.extend({
        //model: User,
        el: $('#user-container'), 
        //add event for saving info
        events:{'click button#score_button' : 'getScore'},
        initialize:function(){

              console.log("init user view");
              _.bindAll(this, 'render'); //keeps 'this' this in afterRender
              this.render = _.wrap(this.render, function(render) {
                  render();
                  this.afterRender();
              });
              this.render(); 
        },
        getScore: function(e){
            e.preventDefault();
            score_url_base =  url_base + "getScore/";
            score_url = score_url_base + this.model.get("_id");
            console.log(score_url)
            $.ajax(score_url, {
                type: "POST",
                success: function(response){
                    $("#score_container h4").html("Your score is " + response + ".")
                    console.log(response)

                }

            });
        },
        saveIdentityInfo: function(e){
            e.preventDefault();
            this.model.set({"name": $('#input-name').val(), "county": $('#input-county').val()})
            this.model.save({
                success: function(model,response){
                    console.log("saved giving info for user " + this.model.get("name"));
                }
            });
                
        },
        saveTransaction: function(e){
          e.preventDefault();
          old_transactions = this.model.get("transactions")
          new_transaction = {
            "vendor": $("#input-transaction-vendor").val(),
            "amount": $("#input-transaction-amount").val()
          };
          old_transactions.push(new_transaction);
          this.model.set({"transactions" : old_transactions});
          this.model.save({
            success: function(model,response){
              console.log("saved transaction for user " + this.model.get("name"));
            }
          });

        },
        saveBankingInfo: function(e){
            e.preventDefault();
            this.model.set({"bank": $('#input-bank').val(), "credit_score": $('#input-credit-score').val()})
            this.model.save({
                success: function(model,response){
                    console.log("saved giving info for user " + this.model.get("name"));
                }
            });
                
        },
        saveGivingInfo: function(e){
            e.preventDefault();
            this.model.set({"donations": $('#input-donations').val(), "volunteer_hours": $('#input-volunteer').val()})
            this.model.save({
                success: function(model,response){
                    console.log("saved giving info for user " + this.model.get("name"));
                }
            });
                
        },
        afterRender: function(){
          
          var user_model = this.model;
          console.log("done rendering user view for user " + user_model.get("name"))
          _.each(myCategories, function(element, index, list){

            console.log(element["name"] + " " + user_model.get("name"));
            element["user"] = user_model;//sends entire user model object to category view for saving info. Can we do this better?
            cat = new Category(element);
            catView = new CategoryView({model: cat});
          });

        },
        render:function(){
            //console.log("rendering user view")
            var user_info = {template_id : this.model.id, 
                            template_name: this.model.get("name"),
                            template_bank: this.model.get("bank"),
                            template_county: this.model.get("county"),
                            template_credit_score: this.model.get("credit_score"),
                            template_donations: this.model.get("donations"),
                            template_volunteer_hours: this.model.get("volunteer_hours"),
                            template_score: this.model.get("score")
                        }          
            user_basic_template = _.template(myTemplates['user_basic']);
            $(this.el).html(user_basic_template());
            home_nav_template = _.template(myTemplates['home_nav']);
            home_pane_template = _.template(myTemplates['home_pane']);
            $('.nav-tabs').append(home_nav_template());
            $('.tab-content').append(home_pane_template(user_info));
        }

    });
    
    //where execution starts
    var myTemplates = 0; //placeholder
    var myCategories = 0; //placeholder
    $.getScript("templates.js", function(){
        myTemplates = template_test;
        //test_templates();
        //$.getScript("categoriesModule.js", function(){
          myCategories = categoriesModule.categoriesModuleFactory()["categories"];
          var users = new Users()
          users.fetch({
            success : function(collection, response){
              //console.log(JSON.stringify("fetched user with id: " + model.get("name")));
              var model = collection.at(1);
              var user_view = new UserView({model: model});
              

            }
          });
        //});

        

    });






    
   
  

    


})(jQuery);