(function($){ 
    var url_base = "http://ec2-54-67-45-196.us-west-1.compute.amazonaws.com/";
    //var url_base = "http://localhost:3000/";

    var Transaction = Backbone.Model.extend({
      defaults: {
        vendor: "unknown",
        amount: 0
      }//,
      // initialize: function(){
      //   console.log("init Transaction model")
      // }
    });

    var TransactionListItemView = Backbone.View.extend({
      template: _.template('<li class="list-group-item"><%=vendor%> ---  $<%=amount%></li>'),

      render:function (eventName) {
          html_string = this.template(this.model.toJSON());
          return html_string;
      }

    });

    var TransactionListView = Backbone.View.extend({
      //el: $('#transactions_container'),
      initialize: function(){
        console.log("init TransactionListView");
        this.render();
      },
      render: function(){
        console.log("rendering transacitons list view")
        //$('#transactions_container').html("transaction view: " + JSON.stringify(this.model))
        $('#transactions_container').append('<ul id="transaction_list" class="list-group"></ul>')
        _.each(this.model.models, function (transaction) {
            $("#transaction_list").append(new TransactionListItemView({model:transaction}).render());
        }, this);
        var form_template = _.template(template_test["transaction_form"]);
        $("#transactions_container").append(form_template);
      }


    });

    var TransactionCollection = Backbone.Collection.extend({
      model: Transaction,
      initialize: function(){
        console.log("transaction collection inited");
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
        events:{
            'click button#giving_save_button' : 'saveGivingInfo',
            'click button#identity_save_button' : 'saveIdentityInfo',
            'click button#banking_save_button' : 'saveBankingInfo',
            'click button#score_button' : 'getScore',
            'click button#transaction_save_button': 'saveTransaction'
        },
        initialize:function(){
            //console.log("init user view");
            _.bindAll(this, 'render');
            //this.render();
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
          console.log("done rendering user view")
          console.log("testing transactions availability in user view after render: " + JSON.stringify(this.model.get("transactions")))
          var user_transactions = new TransactionCollection(this.model.get("transactions"));
          var transactions_view = new TransactionListView({model: user_transactions});
          //var transactions_form_view = new TransactionFormView();
        },
        render:function(){
            //console.log("rendering user view")
            //var tpl = _.template("single user view as template for " +  this.model.id);
            var user_info = {template_id : this.model.id, 
                            template_name: this.model.get("name"),
                            template_bank: this.model.get("bank"),
                            template_county: this.model.get("county"),
                            template_credit_score: this.model.get("credit_score"),
                            template_donations: this.model.get("donations"),
                            template_volunteer_hours: this.model.get("volunteer_hours"),
                            template_score: this.model.get("score")
                        }
            //console.log(JSON.stringify(user_info));             
            
            tpl = _.template(template_test["user_info"]);
            html_string = tpl(user_info);
            $(this.el).append(html_string);
        }

    });
    
    var myTemplates = 0; //placeholder

$.getScript("templates.js", function(){
    var myTemplates = template_test;
    var users = new Users()
    users.fetch({
        success : function(collection, response){
            //console.log(JSON.stringify("fetched user with id: " + model.get("name")));
            var model = collection.at(1);
            var user_view = new UserView({model: model});
            console.log("testing transactions availability: " + JSON.stringify(model.get("transactions")));


        }
    });
});




    
   
  

    


})(jQuery);