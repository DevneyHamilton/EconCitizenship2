var categoriesModule = function(){
	console.log("hello from categories.js version 2");
	var catsToExport = [];

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
		displayName:"Credit Rating",	
		inputs: {"credit_score":"default"},
		calculationFunction : function(inputs){
			return 42;//always return 42
		}
	});


	//The first iteration has a user & coach enter a category 1-5, which is the same as the subscore for this category
	var BankCategory = new ScoringCategory({
		name: "bank",
		displayName: "Banking",
		//may need to create an input object so we can include disply name, variable name, acceptable value range
		inputs: {"bank_score": "default"},
		calculationFunction : function(inputs){
			return(inputs["bank_score"]) //not 100 percent sure this is the function param and not the same as this.inputs
		}
	});

	return catsToExport;
	//return([TestCategory, BankCategory]);//returns list of category objects

};//end categoriesModule