let dropDown = (learningProviders, UOAscores, ref14, data, ref14context, unis) => {
   
    // START DROPDOWN 1
    // Reference: http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8
    let unitsOfAssement = {}

    // Handles changes in the first dropdown
    let dropDownParentChange = function () {
        let ukprn = d3.select(this).property('value')

        // Returns the name of a specific university given the UKPRN
        let provider = ref14.filter((d) => {
            return d.key == ukprn
        })[0].values

        let averaged = provider.map(e => e["overall"]["4*"]).reduce((x,y) => x+y) / provider.length
        chart.GUPLine(averaged)
        console.log(averaged)
    }

    // Creates the first dropdown and binds callback `dropDownParentChange`
    let dropDownParent = d3.select("#uni-dropdown")
        .insert("select", "svg")
        .on("change", dropDownParentChange)
    // Adds initial option in the dropdown
    dropDownParent.append("option").text("-- SELECT a University --")
    // Appends all the options in the dropdown
    dropDownParent.selectAll("option")
        .data(learningProviders)
        .enter().append("option")
            .attr("value", (d) => d.ukprn)
            .text((d) => d.providerName)

   // Start bubbles
   let filterData = filterTreeManager(data.refEntries, ref14context)
   let bubbles = tree(unis)

   bubbles.GUP(filterData)
    // temporary?
    chart = barchart()
}