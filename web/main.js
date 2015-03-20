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
        Backbone.Validation.bind(this);
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
        var cat_inputs = this.model.get("inputs");
        var input_keys = Object.keys(cat_inputs);
        //var selector = "#" + this.model.get("name") + " .user-input-form"
        var selector = "#" + this.model.get("name") + "_inputs_container"
        var input_template = _.template(myTemplates['input_basic']); 
        var cat_name = this.model.get("name");
        _.each(input_keys, function(input_key, index, list){
            console.log("input key in render: " + input_key)
            var input_info = {"tab_title": cat_name,"input_key" : input_key, "input_value": cat_inputs[input_key] };     
            $(selector).append(input_template(input_info));
        });
        var button_selector = "#" + this.model.get("name") + "_save_button"; //has to match buttton id in template
        //bind the save button
        $(button_selector).click(this.saveCategoryInfo);
      },
      saveCategoryInfo : function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        var user_model = this.model.get("user");
        var cat_name = this.model.get("name");
        var cat_inputs = this.model.get("inputs");
        var cat_info ={}; 
        //handle one input - then put this into foreach over inputs, put each one into cat_info
        var input_keys = Object.keys(cat_inputs)
        _.each(input_keys, function(input_key, index, list){
            var input_selector = '#' + input_key + "_input"; //has to match input id in template
            var input_value = $(input_selector).val()
            cat_info[input_key] = input_value; //needs some validation 
            console.log([input_key, input_selector, input_value])
        });
        //try validating:
        var validationResult = categoriesModule.validate(cat_name, cat_info);
       // console.log("validation!: " + JSON.stringify(validationResult));
        var isValid = validationResult["status"];
        var error_selector = "#" + cat_name + "_error_container"
        if(isValid){
            $(error_selector).html(""); //clear error messages
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
        }else{ //invalid input
            //display error messages:
            $(error_selector).html("") //clear
            _.each(validationResult["messages"], function(element){
                console.log(element);
                $(error_selector).append("<p>" + element + "</p>");
            });
        }
      }

    });

    var User = Backbone.Model.extend({
        defaults: {
            name: "unknown",
            county: "Santa Clara",
            data:{}
        },
        url : function() {
            var id = this.get("_id") 
            console.log("user id is: " + id)
            return id ? url_base + 'users/' + id : url_base + 'users';
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
        events:{'click button#score_button' : 'getScore',
                'click button#identity_save_button': 'saveIdentityInfo'},
        initialize:function(){

              console.log("init user view");
              _.bindAll(this, 'render'); //keeps 'this' this in afterRender
              this.render = _.wrap(this.render, function(render) {
                  render();
                  this.afterRender();
              });
              Backbone.Validation.bind(this);
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
                    var score_info = JSON.parse(response);
                    //template this later
                    var score_info_template = _.template('<p>Your <%= score_type%> is: <%= score_value%> <\p> ')
                    var score_type_map = {
                        "raw_score" : "raw Economic Citizenship score",
                        "mapped_score" : "ECONOMIC CITIZENSHIP SCORE",
                        "credit" : "credit subscore",
                        "bank": "banking subscore",
                        "philanthropy" : "community engagement subscore",
                        "savings" : "savings subscore",
                        "groceries" : "groceries subscore",
                        "eating_out" : "subscore for eating out"
                    };
                    var score_keys = Object.keys(score_info);
                    var info_string = "";
                    _.each(score_keys, function(score_key, index, list){
                        if(score_key != "raw_score"){
                            info_string += score_info_template({"score_type": score_type_map[score_key], "score_value": score_info[score_key]});
                        }else{
                            info_string += "<p>=====================================</p>";
                        }
                    });
                   // info_string = score_info_template({"score_type" : "raw Economic Citizenship score", "score_value" :score_info["raw_score"] });
                    //info_string += score_info_template({"score_type" : "score scaled to Credit Scoring", "score_value" : score_info["mapped_score"]  });
                    //info_string += score_info_template({"score_type" : "banking subscore", "score_value" : score_info["bank"]});
                    $("#score_container").html(info_string)
                    console.log(response)

                }

            });
        },
        saveIdentityInfo: function(e){
            e.preventDefault();
            console.log("saving id info: " + this.model.id);
            var idInfoToSave = {"name": $('#input-name').val(), "county": $('#input-county').val()};
            console.log(JSON.stringify(idInfoToSave));
            this.model.set({"name": $('#input-name').val(), "county": $('#input-county').val()})

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
        console.log("in main I'm editing");
        myTemplates = template_test;
        //test_templates();
        //$.getScript("categoriesModule.js", function(){
          myCategories = categoriesModule.getCategories();
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