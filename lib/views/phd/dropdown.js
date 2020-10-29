/*-------------------------------------------------------------------- 
  
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Initialises both dropdowns.
        Initialises, for the first time, the dendrogram with all the universities, regions and countries.
        Initialises, cleans, and update the UK map.
        Initialises brush tool on the Uk map.
        Initialises, cleans, and update ranking table.   
  
    Dependencies
        D3.js v4   
    
    Reference: 
        http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8
---------------------------------------------------------------------- */


/*
* Function as class that makes the dropdowns work.
*/
let dropDown = (learningProviders, UOAscores, ref14, providersByUoA) => {
    
    /*Variables*/   
    let unitsOfAssement = {}

    // Handles changes in the #uni-dropdown dropdown
    let dropDownUniversitiesOnChange = function () {
        // Cleaning elements
        let ukprn = d3.select(this).property('value');
     
        dropDownUOA.html("").append("option").attr("value", "0").text("-- SELECT Unit of Assessment --"); // Initial option on dropdown
        
        map.CLEAN_MAP(); // Clean pins on MAP
        
        // Return if not valid University value.
        if(ukprn==0){ 
            dropDownUOA.selectAll(null)._parents[0].disabled = true; 
             // Cleans dendrogram for new entires at selecting any unite of assesment
            tr1.loadAndRenderFlatDataset([], "United Kingdom", [{key:"refEntry => refEntry['country']"},{key:"refEntry => refEntry['region']"}]);
            
            // Initialise ranking table and cleans it.
            rankingUniversities();
            return;
        }
        
        //Enable select
        dropDownUOA.selectAll(null)._parents[0].disabled = false;
        
        // Returns the units of assessment for a specific university given the UKPRN
        unitsOfAssement = UOAscores.filter((d) => {
            return d["Institution code (UKPRN)"] == ukprn
        });

        // Returns the coordinates for a specific university given the UKPRN
        let coordinates = learningProviders.filter((d) => {
            return d.ukprn == ukprn
        })[0].coordinates;

        // Returns the name of a specific university given the UKPRN
        let providerName = learningProviders.filter((d) => {
            return d.ukprn == ukprn
        })[0].providerName;

        // Update dropdown 2 with Units of Assessment according to ukprn 
        dropDownUOA.selectAll(null) //Fixing Select to append options after existed
            .data(unitsOfAssement)
            .enter()                                // enter selection
            .append("option")                       
            .attr("value", (d) => d.UoAValue)
            .text((d) => d.UoAString)

        // Exit selection
        dropDownUOA.exit().remove()

        // Cleans dendrogram for new entires at selecting any unite of assesment
        tr1.loadAndRenderFlatDataset([], "United Kingdom", [{key:"refEntry => refEntry['country']"},{key:"refEntry => refEntry['region']"}]);
        
        // Initialise ranking table and cleans it.
        rankingUniversities();
    }


    // Initialise unite of assessments dropdown.
    let droptDownUnisbyUoA = function () {
        // Gets selected unite of assessment's value.
        let UoAValue = d3.select(this).property('value');
        
        // Filters to bring Universities within the selected unite of assessment.
        universitiesByUnitsOfAssement = providersByUoA.filter((d) => {
            return d.key == UoAValue;
        });

        // Initialise params to make the ranking table base on any/some/all of the aspects: Overall, Environment, Impact, Outputs. 
        // In this case it brings the ranking table considering only the overall mark.
        let param = [{key:"overall", value:1},{key:"environment", value:0},{key:"impact", value:0},{key:"outputs", value:0}];

        // Gets the data ranked.
        let data_ranked = rankingData(universitiesByUnitsOfAssement[0].values,param);

        // Renders dendogram with the new data ranked.
        renderThreeNewData(data_ranked);

        map.CLEAN_MAP(); // Clean pins on MAP

        // Updates all the pins for the ranked data.
        data_ranked.forEach((d)=>{
            // Returns the coordinates for a specific university given the UKPRN
            let coordinates = learningProviders.filter((e) => {
                return e.ukprn == d['Institution code (UKPRN)']
            })[0].coordinates;
            d.coordinates = coordinates;
            // Add coordinates to the map
            map.GUP(coordinates,d.region,getCountryByRegion(d.region),d['Institution code (UKPRN)'],d.rank,d['Institution name'],d.overall,data_ranked);
        });
            
        // Initialises the Brush tool on the map.
        map.BRUSH(data_ranked)
        
        // Refresh ranking table based on the data obtained from the UK map.
        rankingUniversities();
    }

    // Initialize Universities dropdown and binds callback functions
    let dropDownUniversities = d3.select("#uni-dropdown")
                                .insert("select", "svg")
                                .on("change", dropDownUniversitiesOnChange);
    dropDownUniversities.append("option").attr("value", "0").text("-- SELECT a University --") // Adds initial option in the dropdown

    // Initialize unite of assessments dropdown and binds callback functions
    let dropDownUOA = d3.select("#uoa-dropdown")
                        .insert("select", "svg")
                        .on("change", droptDownUnisbyUoA);
    dropDownUOA.attr("disabled",true).append("option").attr("value", "0").text("-- SELECT Unit of Assessment --"); // Initial option on dropdown


    // Appends all the options into #uni-dropdown for the first run.
    dropDownUniversities.selectAll(null)
        .data(learningProviders)
        .enter().append("option")
        .attr("value", (d) => d.ukprn)
        .text((d) => d.providerName)

    // Renders UK map
    let map = ukMap();
}