var template_test = {
  "user_basic":'<div role="tabpanel"> \
                  <ul class="nav nav-tabs" role="tablist">\
                  </ul>\
                </div>\
                <div class="tab-content"></div>\
  ',
  "input_basic":'<div class="input-group">\
                   <span class="input-group-addon"><%= input_key%>: </span>\
                   <input type="text" class="form-control" placeholder="" id="<%= input_key%>_input" value="<%= input_value%>">\
                </div>',
  "tab_nav_basic":'<li role="presentation" ><a href="#<%= tab_title%>" aria-controls="<%= tab_title%>" role="tab" data-toggle="tab"><%= display_name%></a></li>',
  "tab_pane_basic":'<div role="tabpanel" class="tab-pane" id="<%= tab_title%>">\
                      <div class="container">\
                        <h3><%= display_name%> </h3>\
                        <div style="padding: 20px 20px 10px;">\
                          <form class="user-input-form" role="form">\
                            <div id="<%= tab_title%>_inputs_container"></div>\
                            <button class="btn btn-default" id="<%= tab_title%>_save_button">Save <%= display_name%> Information</button>\
                          </form>\
                        <div>\
                      </div>\
                    </div>',
  "home_nav": '<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>',
  "home_pane": '<div role="tabpanel" class="tab-pane active" id="home">\
        <div class="container">\
          <h3>Tell Us About Who You Are . . .. </h3>\
            <div style="padding: 20px 20px 10px;">\
              <form class="user-input-form" role="form">\
                <div class="input-group">\
                   <span class="input-group-addon">My name is </span>\
                   <input type="text" class="form-control" placeholder="" id="input-name" value="<%= template_name%>">\
                </div>\
                <div class="input-group">\
                   <span class="input-group-addon">I live in </span>\
                   <input type="text" class="form-control" placeholder="" id="input-county" value="<%= template_county%>">\
                   <span class="input-group-addon"> County.</span>\
                </div> \
                  <button class="btn btn-default" id="identity_save_button">Save Identity Information</button>\
             </form>\
            </div>\
            <div id="score_container">\
              <h4> Your score is currently <%=template_score%>.</h4>\
              <button class="btn btn-default" id="score_button">Update Score</button>\
            </div>\
          </div>\
        </div>',
	"user_info" : '<div role="tabpanel"> \
                    <!-- Nav tabs -->\
                    <ul class="nav nav-tabs" role="tablist">\
      <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>\
      <li role="presentation"><a href="#giving" aria-controls="My Giving" role="tab" data-toggle="tab">My Giving</a></li>\
       <li role="presentation"><a href="#banking" aria-controls="My Banking" role="tab" data-toggle="tab">My Banking</a></li>\
      <li role="presentation"><a href="#spending" aria-controls="My Spending" role="tab" data-toggle="tab">My Spending</a></li>\
    </ul>\
    <!-- Tab panes -->\
    <div class="tab-content">\
      <div role="tabpanel" class="tab-pane active" id="home">\
        <div class="container">\
          <h3>Tell Us About Who You Are . . .. </h3>\
            <div style="padding: 20px 20px 10px;">\
              <form class="user-input-form" role="form">\
                <div class="input-group">\
                   <span class="input-group-addon">My name is </span>\
                   <input type="text" class="form-control" placeholder="" id="input-name" value="<%= template_name%>">\
                </div>\
                <div class="input-group">\
                   <span class="input-group-addon">I live in </span>\
                   <input type="text" class="form-control" placeholder="" id="input-county" value="<%= template_county%>">\
                   <span class="input-group-addon"> County.</span>\
                </div> \
                	<button class="btn btn-default" id="identity_save_button">Save Identity Information</button>\
             </form>\
            </div>\
            <div id="score_container">\
            	<h4> Your score is currently <%=template_score%>.</h4>\
            	<button class="btn btn-default" id="score_button">Update Score</button>\
            </div>\
          </div>\
        </div>\
    <div role="tabpanel" class="tab-pane" id="giving">\
        <div class="container">\
            <h3>Tell Us About Your Giving . . . </h3>\
            <div style="padding: 20px 20px 10px;">\
              <form class="user-input-form" role="form">\
                <div class="input-group">\
                   <span class="input-group-addon">I gave $</span>\
                   <input type="text" class="form-control" placeholder="" id="input-donations" value="<%= template_donations%>">\
                   <span class="input-group-addon">.00 to charity</span> \
                </div>\
                <div class="input-group">\
                   <span class="input-group-addon">I volunteered </span>\
                   <input type="text" class="form-control" placeholder="" id="input-volunteer" value="<%= template_volunteer_hours%>">\
                   <span class="input-group-addon"> hours in my community.</span>\
                </div>\
                <button class="btn btn-default" id="giving_save_button">Save Giving Information</button>\
              </form>\
            </div>\
        </div>\
    </div>\
    <div role="tabpanel" class="tab-pane" id="banking">\
        <div class="container">\
          <h3>Tell Us About Your Banking . . . </h3>\
          <div style="padding: 20px 20px 10px;">\
            <form class="user-input-form" role="form">\
              <div class="input-group">\
                <span class="input-group-addon">I use </span>\
                <input type="text" class="form-control" placeholder="" id="input-bank" value="<%= template_bank%>">\
                <span class="input-group-addon"> for banking</span> \
              </div>\
              <div class="input-group">\
                <span class="input-group-addon">My credit score is </span>\
                <input type="text" class="form-control" placeholder="" id="input-credit-score" value="<%= template_credit_score%>">\
              </div>\
              <button class="btn btn-default" id="banking_save_button">Save Banking Information</button>\
            </form>\
          </div>\
        </div>\
    </div>\
    <div role="tabpanel" class="tab-pane" id="spending">\
    	<div style="padding: 20px 20px 10px;">\
    		<div class="container"id="transactions_container">\
    		<h4> Transaction History:  </h4>\
    		</div>\
    	</div>\
  	</div>\
 </div>',

 "transaction_form" : '<h4> Add a new transaction:  </h4>\
 			<form class="transaction-input-form" role="form">\
              <div class="input-group">\
                <span class="input-group-addon">Vendor: </span>\
                <input type="text" class="form-control" placeholder="" id="input-transaction-vendor" value="">\
              </div>\
              <div class="input-group">\
                <span class="input-group-addon">Amount: $ </span>\
                <input type="text" class="form-control" placeholder="" id="input-transaction-amount" value="">\
              </div>\
              <button class="btn btn-default" id="transaction_save_button">Save New Transaction</button>\
            </form>'
};

