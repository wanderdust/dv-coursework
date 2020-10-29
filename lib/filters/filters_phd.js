/*-------------------------------------------------------------------- 
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Filters data 
  
    Dependencies
        D3.js v4   
    
---------------------------------------------------------------------- */

// Return Learning Providers and their UKPRN ID
let filterLearningProviders = (data) => {
    return data.map((d) => {
        if (d.LONGITUDE.length === 0 ) {
            d.LONGITUDE = "-5.926437";
            d.LATITUDE = "54.607868";
        }
        return {
            providerName: d.PROVIDER_NAME,
            ukprn: d.UKPRN,
            coordinates: [d.LONGITUDE, d.LATITUDE],
            
        }
    })
}

/* getlearningProviders: Return learning providers map.
* @return providerName:[d.VIEW_NAME], UKPRN, COORDINATES:[d.LONGITUDE, d.LATITUDE]
**/
let getlearningProviders = (data) => {
    data = data.sort(function(x, y){
       return d3.ascending(x.VIEW_NAME, y.VIEW_NAME);
    });
    return data.map((d) => {
        if (d.LONGITUDE.length === 0 ) {
            d.LONGITUDE = "-5.926437";
            d.LATITUDE = "54.607868";
        }
        return {
            providerName: d.VIEW_NAME,
            ukprn: d.UKPRN,
            coordinates: [d.LONGITUDE, d.LATITUDE],
            
        }
    })
}

/*
* Return data nested by Unite of Assesment
*/
let filterUniversitiesByUoA = (data) => {
    data = data.sort(function(x, y){
       return d3.ascending(x['Institution name'], y['Institution name']);
    });
    let data_nested = d3.nest()
        .key(refEntry => refEntry["UoAValue"])
        .entries(data);
    return data_nested.sort(function(x, y){
        return d3.ascending(parseInt(x.key), parseInt(y.key));
    });
}

/*
* Return data sorted and nested by country, region and unit of assessment.
*/
let filterUniversitiesByUoAByRegionByCountry = (data) => {
    data = data.sort(function(x, y){
       return d3.ascending(x['Institution name'], y['Institution name']);
    });
    let data_nested = d3.nest()
        // .key(refEntry => refEntry["UoAValue"])
        .key(refEntry => refEntry["country"])
        .key(refEntry => refEntry["region"])
        .key(refEntry => refEntry["UoAValue"])
        .rollup(values => values)
        .entries(data);
    return data_nested.sort(function(x, y){
        return d3.ascending(parseInt(x.key), parseInt(y.key));
    });
}

// Returns nested data for a provider
let filterUOA = (data, rating = "overall") => {

    return d3.nest()
        .key(refEntry => refEntry["Institution code (UKPRN)"])
        .entries(data)

}

/*
* Return data nested by reference.
*/
let nestDataByReference = (reference,data) => {
    return d3.nest()
        .key(refEntry => refEntry[reference])
        .entries(data)
}

/*
* Return data adding comparing_overall attribute in which depending on the function params, it rank the universities.
*/
let rankingData = (data,param= [{key:"overall", value:0},{key:"environment", value:0},{key:"impact", value:0},{key:"outputs", value:0}]) => {
    data.map((d) => {
        var four_total = 1;
        var three_total = 1;
        var two_total = 1;
        var one_total = 1;

        param.forEach((e)=>{
            /*
            * Fixing values: Adding on the numbers right side a 1 and multiply this new number by 10.
            */
            if(e.value==1){
                four_total += d[e.key]['4*']*10;
                three_total += d[e.key]['3*']*10;
                two_total += d[e.key]['2*']*10;
                one_total += d[e.key]['1*']*10;    
            }
        });            
            
        /*
        * Fixing values: Adding on the numbers right side zeros until have a number with 5 digits 
        * in order to normalize and scale values to remain the original number's value (position) in major menor logic.
        * This means that the number after above process: 101 will be added two zeros 10100 to have 5 digits. To then concatenate all numbers to generate a new number to be compared 
        */
        d.comparing_overall = parseFloat(String(four_total).concat(String(three_total).padStart(5, '0'), String(two_total).padStart(5, '0'), String(one_total).padStart(5, '0'))) 

    });

    // Sorting data based on comparing_overall value
    data = data.sort(function(x, y){ return d3.descending(x['comparing_overall'], y['comparing_overall']);})

    // Adding rank attribute and the position.
    let rank = 1;
    data.map((d) => { 
        d.rank  = rank++;
    });    

    return data;
}


// Return universities nested by region.
let getUniversitiesByRegion = (data, region = null) => {
    return data_nested = d3.nest()
        .key(refEntry => refEntry["region"])
        .entries(data);
}

// Return a country's region label.
let getCountryByRegion = (region) =>{
    switch(region) {
        case "SCOT":
            return "SCT";
            break;
        case "NIRE":
            return "NIR";
            break;
        case "WALE":
            return "WLS";
            break;
        default:
            return "ENG";
    }
}

// Set region and country to universities
let setRegionAndCountry = (data, context) => {
    return data.map(d => {
        let region = context.filter(e => {
            return e.UKPRN == d["Institution code (UKPRN)"];
        })
        try {
            d.region = region[0]["Region of provider"];
            d.country = getCountryByRegion(d.region);
            d.united_kingdom = "UK";
        } catch {
            d.region = "LOND";
            d.country = getCountryByRegion(d.region);
            d.united_kingdom = "UK";
        }
        return d;
    });
}