/*-------------------------------------------------------------------- 
      
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Rankings handler.
        Highlight pins on maps.
        Brush render
  
    Dependencies
        D3.js v4   
    
---------------------------------------------------------------------- */

// Main function which initialises the ranking table
function rankingUniversities(country_id = "") {

    // Getting data. Note that country_id it is no used anymore as the selection has changed through be made by the brush tool.
    let data = universitiesOnCountry(country_id);

    //Mouse-over handler
    let handleMouseOver = function () {
        let data = d3.select(this.parentNode).selectAll("td").data();
        let ukprn = data.filter(function(d) { if(d.ukprn !== undefined){return d.ukprn;}});
        highlightPins(ukprn);
    }

    //Mouse-out handler
    let handleMouseOut = function () {
        let data = d3.select(this.parentNode).selectAll("td").data();
        let ukprn = data.filter(function(d) { if(d.ukprn !== undefined){return d.ukprn;}});
        unhighlightPins(ukprn);
    }

    // Initialise table.
    var table = d3.select("#rankings");
    // Cleans all data from table.
    table.select("tbody").remove();

    var tbody = table.append("tbody");

    var tr = tbody.selectAll("tr");
    // Enters data and append tr for each row in data.
    var rows = tr.data(data)
                .enter()
                .append("tr");


    var row_entries = rows.selectAll("td");

    // Appends all td for each row.
    row_entries.data(function(row) {
            return ["country", "uni_name", "rank", "ukprn"].map(function(column) {
                if(column == "ukprn"){ return {ukprn: row[column].value};}else{
                return {value: row[column].value};}
            });
        })
        .enter()
        .append("td")
        .style("cursor","pointer")
        .text(function(d) { return d.value; })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    rows.exit().remove();
}

//Select all images (pins) from map and filter by country_id if not null
function universitiesOnCountry(country_id) {
    let data = new Array();
    d3.select(".svg-container").selectAll("image"+country_id)._groups[0].forEach((d)=>{ if (d.attributes !== "") {data.push(d.attributes);}});
    return data;
}

// Changes pin image (from the map) to one in blue colour for the selected tr on table
function highlightPins(pins) {
    pins.forEach((d)=>{
        d3.select(".svg-container").selectAll("image[ukprn='"+d.ukprn+"']").transition().attr("xlink:href", "images/pin_selected.svg");
    });
}

// Return normal red image
function unhighlightPins(pins) {
    pins.forEach((d)=>{
        d3.select(".svg-container").selectAll("image[ukprn='"+d.ukprn+"']").transition().attr("xlink:href", "images/pin.svg");
    });
}

// Rendering brushed data onto table. Same function as rankingUniversities but obtaining data to display from UK map. 
function rankingUniversitiesBrushed(dataBrushed) {
    
    let handleMouseOver = function () {
        let data = d3.select(this.parentNode).selectAll("td").data();
        let ukprn = data.filter(function(d) { if(d.ukprn !== undefined){return d.ukprn;}});
        highlightPins(ukprn);
    }

    let handleMouseOut = function () {
        let data = d3.select(this.parentNode).selectAll("td").data();
        let ukprn = data.filter(function(d) { if(d.ukprn !== undefined){return d.ukprn;}});
        unhighlightPins(ukprn);
    }

    var table = d3.select("#rankings");
    table.select("tbody").remove();

    var tbody = table.append("tbody");

    var tr = tbody.selectAll("tr");

    var rows = tr.data(dataBrushed)
                .enter()
                .append("tr");


    var row_entries = rows.selectAll("td");

    row_entries.data(function(row) {
            return ["country", "uni_name", "rank", "ukprn"].map(function(column) {
                if(column == "ukprn"){ return {ukprn: row[column].value};}else{
                return {value: row[column].value};}
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    rows.exit().remove();
}