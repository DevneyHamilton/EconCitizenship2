(function(exports){
	exports.categoriesModuleFactory = function(){ //hacky - need to clean up. this module should just export itscomponents, not itself
		console.log("categoriesModule executing from file I'm editing score mapping in on amazon");
		var module = {};
		var catsToExport = [];

		//currently takes inputs object. Should just take array. 
		var getWeightedAvg = function(inputs){
			var weighted_avg = 0;
			var original_totals = [];
			var keys = Object.keys(inputs);
			var grand_total = 0.0
			for(var i = 0; i < keys.length; i++ ){
				var total = parseInt(inputs[keys[i]]) + 0.0;
				original_totals.push(total);
				grand_total += total;
			}
			console.log("grand_total: " + grand_total);
			console.log("original_totals: " + JSON.stringify(original_totals));
			for(var i = 0; i < original_totals.length; i++){
				if(grand_total > 0){
					weighted_avg += (i+1) * original_totals[i]/grand_total
				}
			}
			return Math.ceil(weighted_avg);

		}

		var mapEconCitScoreToCreditScoreScale = function(score){
            var EconCitRange = [0,6]
			var CSRange = [300, 550]
            if(score < 7){
                EconCitRange = [0,6]
                CSRange = [300, 549]
            }else if(score< 13){
                EconCitRange = [7,12]
                CSRange = [550, 619]
                
            }else if(score < 19){
                EconCitRange = [13,18]
                CSRange = [620, 679]
            }else if(score < 25){
                EconCitRange = [19,24]
                CSRange = [680, 739]
            }else{
                EconCitRange = [25,30]
                CSRange = [740, 850]   
            }
			var multiplier = (CSRange[1] - CSRange[0])/(EconCitRange[1] - EconCitRange[0])
			//subtract the min in the econCitRange, then add that times the multiplier to the min of the CS range
			var value =  CSRange[0] + multiplier * (score - EconCitRange[0])
			return value;
		}
        

		var ScoringFunction = function(user_data, categories){ //passing catsToExport back into this function. That's weird, need to figure out how to use this properly.
			var catsFromUser = Object.keys(user_data); //user only has cat stored if they saved a val for it
			var score = 0; //for now we will just add, then I'll include the mapping to credit score vals
			var score_info = {}
			categories.forEach(function(element, index, list){
				var cat_name = element["name"];
				if(cat_name in user_data){
					var subscoreFun = element["calculationFunction"];
					var subscore = subscoreFun(user_data[cat_name])
					console.log(cat_name + " subscore: " + subscore);
					score += subscore;
					score_info[cat_name] = subscore;
				}
			});
			var raw_score = score;
			score_info["raw_score"] = score;
			
			var mapped_score = mapEconCitScoreToCreditScoreScale(score);
			score_info["mapped_score"] = mapped_score;
			//var score_info = {"raw_score" : score, "mapped_score" : mapped_score};
			var res_string = JSON.stringify(score_info);
			return res_string;
		};

		module["ScoringFunction"] = ScoringFunction;


		var ScoringCategory = function(params){
			this.name = params["name"];
			this.displayName = params["displayName"];
			this.inputs = params["inputs"];
			this.calculationFunction = params["calculationFunction"];
			catsToExport.push(this); //adds to catsToExport so all are avai
		};

		//1) try making an array to push to
		//2) try pushing 'this' inside teh ScoringCategory constructor


		var CreditCategory = new ScoringCategory({
			name: "credit",
			displayName:"Credit Score",	
			inputs: {"credit_score":"default"},
			calculationFunction : function(inputs){
				var subscore = 0;
				var credit_score = parseInt(inputs["credit_score"]);
				if(credit_score < 550){
					subscore = 1;
				}else if(credit_score < 620){
					subscore = 2;
				}else if(credit_score < 680){
					subscore = 3;
				}else if(credit_score < 740){
					subscore =4;
				}else{
					subscore = 5;
				}
				return subscore;
			}
		});


		//The first iteration has a user & coach enter a category 1-5, which is the same as the subscore for this category
		var BankCategory = new ScoringCategory({
			name: "bank",
			displayName: "Banking Practice",
			//may need to create an input object so we can include disply name, variable name, acceptable value range
			inputs: {"bank_score": "default"},
			calculationFunction : function(inputs){
				return(parseInt(inputs["bank_score"])) //not 100 percent sure this is the function param and not the same as this.inputs
			}
		});

		var PhilanthropyCategory = new ScoringCategory({
			name: "philanthropy",
			displayName: "Community Engagement",
			inputs: {
				"hours_volunteered": 1,
				"donations_in_dollars" : 1,
				"net_income": 1,
				"county": "unknown"
			},
			calculationFunction:function(inputs){
				var subscore = 0;
				var county_average= .04 //hardcoded
				var donations = parseInt(inputs["donations_in_dollars"]);
				var hours = parseInt(inputs["hours_volunteered"]);
				var income = parseInt(inputs["net_income"]) + 0.0;
				if(income > 0){
					var raw_score = (donations + 22.5 * hours)/income
					console.log("phil raw score:" + raw_score)
					var adjusted_score = raw_score/county_average;
					console.log("phil adjusted_score score:" + adjusted_score)
					if(adjusted_score == 0){
						subscore = 1;
					}else if(adjusted_score < .9){
						subscore = 2;
					}else if(adjusted_score < 1.1){
						subscore = 3;
					}else if(adjusted_score < 2){
						subscore = 4;
					}else{
						subscore = 5;
					}
				}
				return subscore;
			}
		})

		var SavingsCategory = new ScoringCategory({
			name: "savings",
			displayName: "Savings",
			inputs:{"net_income": 1, "total_expenses" : 1},
			calculationFunction: function(inputs){
				var savings_subscore = 0;
				var income = parseInt(inputs["net_income"]) + 0.0; //hack to make float
				var expenses = parseInt(inputs["total_expenses"]) + 0.0
				if (expenses > 0){ //don't divide by 0
					var ratio = income/expenses;
					if(ratio < .95){
						savings_subscore = 1;
					}else if (ratio < 1){
						savings_subscore = 2;
					}else if(ratio < 1.05){
						savings_subscore = 3;
					}else if(ratio < 1.1){
						savings_subscore = 4;
					}else{
						savings_subscore = 5;
					}
				}
				return savings_subscore;
			}
		});

		var GroceriesCategory = new ScoringCategory({
			name: "groceries",
			displayName: "Groceries/Household",
			inputs:{
				"groceries_type_1_total" : 0,
				"groceries_type_2_total" : 0,
				"groceries_type_3_total" : 0,
				"groceries_type_4_total" : 0,
				"groceries_type_5_total" : 0
			},
			calculationFunction : function(inputs){
				return getWeightedAvg(inputs);
			}

		});

		var EatingOutCategory = new ScoringCategory({
			name: "eating_out",
			displayName: "Eating Out",
			inputs: {
				"type_1_total" : 0,
				"type_2_total" : 0,
				"type_3_total" : 0,
				"type_4_total" : 0,
				"type_5_total" : 0
			},
			calculationFunction: function(inputs){
				return getWeightedAvg(inputs);
			}
		});

		module["categories"] = catsToExport;
		return module;
		//return([TestCategory, BankCategory]);//returns list of category objects

	};//end categoriesModule
})(typeof exports === 'undefined' ? this['categoriesModule']={} : exports);//end closure
