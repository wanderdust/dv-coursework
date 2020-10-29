/*-------------------------------------------------------------------- 
    Module: Functionaly based on one lab made by Prof. Mike Chantler

    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Dendrogram handler 
  
    Dependencies
        D3.js v4   

    Reference:
        Work done in one of the Data Visualisation labs from Prof. Mike Chantler
    
---------------------------------------------------------------------- */

var tr1;
var keys_tree;

// Function handler for
let dendrogram = (data, providersByUoAByRegionByCountry, providersByUoA, tierMapInit) => {
    /*Variables*/   
    let unitsOfAssement = {};
    let entries = data.refEntries;
    var obj = {};

    // Removing universities duplicates.
    for ( var i=0, len=entries.length; i < len; i++ )
        obj[entries[i]["Institution code (UKPRN)"]] = entries[i];

    entries = new Array();
    for ( var key in obj )
        entries.push(obj[key]);

    // Initialising tree and entering first keys with data entries.
    // At first run, this dendrogram displays all countries, regions, and universities.
    // However, it is not very readable.
    keys_tree = [{key:"refEntry => refEntry['country']"},{key:"refEntry => refEntry['region']"}];
    tr1 = tree("#dendrogram",tierMapInit)
        .appendClickFunction(treeClickFunction)
        .loadAndRenderFlatDataset(entries, "United Kingdom", keys_tree);
}

function treeClickFunction(d){
    //Dado por hecho que ya esta seleccionado un valor
    if(d.data.key == "United Kingdom"){
        // console.log(d);        
    }
}

// Render data from the ranking table once a unite of assessment has been selected.
function renderThreeNewData(data_ranked) {
    let UoAValue = d3.select("#uoa-dropdown").select("select").property('value');
    universitiesByUnitsOfAssement = providersByUoA.filter((d) => {
        return d.key == UoAValue;
    });
    if (UoAValue == 0) return ;
    return tr1.loadAndRenderFlatDataset(universitiesByUnitsOfAssement[0].values, "United Kingdom", keys_tree);
}