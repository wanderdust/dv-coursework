/*-------------------------------------------------------------------- 
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Initialises the application. 
  
    Dependencies
        D3.js v4   
---------------------------------------------------------------------- */

/**
* This variables are using across js files in order to share data.
* Note. Not the best practice but no data has been found confidential in this application.
**/

var globalData;
var data_initApp;
var providers;
var groupedProviders;
var providersByUoA;
var providersByUoAByRegionByCountry;
var universitiesByUnitsOfAssement;


/*
* This function initialise the application
*/
let initialiseApp = (error, ref14data, ref14context , learningProviders, jsonTopicData , ref14Results, tierRecords, tierIndexs, tierColumns, tierSplit, tierTable, tierValues) => {
    
    // Initialises the model (class) which construct the data for this app.   
    let dataModel =  modelConstructor().addBasicTopicArrayData(true);

    // Function that loads the data from the files
    dataModel.loadData(ref14data, ref14context , learningProviders, jsonTopicData, ref14Results);	

    // Function that returns the object with all the data processed.
    data_initApp = dataModel.model();

    // Setting region and country to all the entries
    setRegionAndCountry(data_initApp.refEntries, ref14context);

    // Getting all learning providers (universities) map
    providers = getlearningProviders(learningProviders);

    // Getting nested data by learning provider (university)
    groupedProviders = filterUOA(data_initApp.refEntries);

    // Getting providers (universities) nested by Unite of Assesment
    providersByUoA = filterUniversitiesByUoA(data_initApp.refEntries);

    // Getting providers (universities) nested by country, region, and unite of assesment
    providersByUoAByRegionByCountry = filterUniversitiesByUoAByRegionByCountry(data_initApp.refEntries);

    // Initialises dropdown for university and unite of assesments. The UK map, as well as the ranking table, are initialised within this function.
    dropDown(providers, ref14data, groupedProviders, providersByUoA);
    
    // Initialises Tier (extra) data. 
    let tierModel = tierConstructor();
    // Loading data from model.
    tierModel.loadData(tierRecords, tierIndexs, tierColumns, tierSplit, tierTable, tierValues);
    // Getting data from model.
    tiersData = tierModel.model();

    // Initialises Tier (extra) section for PHD student.
    let tierMapInit = tierChart(tiersData);
    // Call to render Treemaps
    tierMapInit.tierTreeMap();

    // Initialises dendogram chart.
    dendrogram(data_initApp,providersByUoAByRegionByCountry,providersByUoA,tierMapInit);
}

// D3 Queue all process and await to initialise app.
d3.queue()
    .defer(d3.csv, "data/topics/REF2014T30TopicOrder.csv")
    .defer(d3.csv, "data/290183_REF_Contextual_table_1314_0.csv")
    .defer(d3.csv, "data/learning-providers-plus.csv")
    .defer(d3.json, "data/topics/REF2014T30Python.json")
	.defer(d3.csv, "data/REF2014_Results.csv")
    .defer(d3.json, "data/tier/companies_coor_records.json")
    .defer(d3.json, "data/tier/companies_coor_index.json")
    .defer(d3.json, "data/tier/companies_coor_columns.json")
    .defer(d3.json, "data/tier/companies_coor_split.json")
    .defer(d3.json, "data/tier/companies_coor_table.json")
    .defer(d3.json, "data/tier/companies_coor_values.json")
    .await(initialiseApp)
