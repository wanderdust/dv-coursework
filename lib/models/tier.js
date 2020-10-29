/*-------------------------------------------------------------------- 
  
   Module: data model class implemented in Bostock's functional style
   Author: Josue Caleb Almaraz Puente
  
   What it does:
  	Read and process data from the json files in data/tier folder. 
  
   Dependencies
  	D3.js v4   
---------------------------------------------------------------------- */

"use strict";
function tierConstructor() { 
	//Here we use a function declaration to imitate a 'class' constructor
	//
	//Invoking the function will return an object (modelObject) with the public
	// methods listed below
	//    e.g. model1 = modelConstructor()
	//
	

	//====Declare the main object that will be returned to caller ============
	//
	var modelObject = {};
	
	//=================== PUBLIC FUNCTIONS =========================
	//
	modelObject.loadData = function (tierRecords, tierIndexs, tierColumns, tierSplit, tierTable, tierValues) {
		dataModel.tierRecords = records(tierRecords);
		return modelObject; //For chaining
	}
	
	modelObject.model = function (){return dataModel}
		
	
	//=================== PRIVATE VARIABLES ====================================

	var dataModel = {};

	//=================== CONSTRUCTOR CODE ====================================
	// -- nothing at the moment


	//======================== PRIVATE FUNCTIONS =================================
	function records(tierRecords) {
		var tiers = []; //Used to accumulate Return object
		// var types = d3.map(tierRecords, function(d){return d.tier;}).keys(); //Types of tiers

		for (var key in tierRecords) {
			tierRecords[key].coordinates = [tierRecords[key].longitude,tierRecords[key].latitude];
		}
		var types = d3.nest().key(function(d) { return d.tier; }).entries(tierRecords);

		return tierRecords;
	}


	//================== IMPORTANT do not delete ==================================
	return modelObject; // return the main object to the caller to create an instance of the 'class'
	
} //End of model() declaration	

