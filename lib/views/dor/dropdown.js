let dropDown = (learningProviders, UOAscores, ref14, ref14data, context) => {
   
    // START DROPDOWN 1
    // Reference: http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8
    let unitsOfAssement = {}

    // Handles changes in the first dropdown
    let dropDownParentChange = function () {
        let ukprn = d3.select(this).property('value')

        // Returns the units of assessment for a specific university given the UKPRN
        unitsOfAssement = UOAscores.filter((d) => {
            return d["Institution code (UKPRN)"] == ukprn
        })

        // Returns the coordinates for a specific university given the UKPRN
        let coordinates = learningProviders.filter((d) => {
            return d.ukprn == ukprn
        })[0].coordinates

        // Returns the name of a specific university given the UKPRN
        let providerName = learningProviders.filter((d) => {
            return d.ukprn == ukprn
        })[0].providerName

        dropDownUOA.html("") // Reset the child dropdown everytime there is a change

        dropDownUOA.append("option").text("-- SELECT Unit of Assessment --") // Initial option on dropdown

        // Update dropdown 2 with new units of assessment
        // enter selection
        dropDownUOA.selectAll("option")
            .data(unitsOfAssement)
            .enter().append("option")
                .attr("value", (d) => d.DocumentID)
                .text((d) => d.UoAString)

        // Exit selection
        dropDownUOA.exit().remove()

        // Add coordinates to the map
        map.GUP(coordinates)

        // Add title to barchart 1
        barChart.renderTitle(providerName)

        //Render barchart2
        let myData = ref14.filter(d => d.key == ukprn)[0]
        console.log(myData)
        chart.GUP(myData, providerName)       
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


    // START DROPDOWN 2
    // Callback. Returns the ratings for a specific type (environment, overall, etc.)
    let dropDownChildChange = function () {
        value = d3.select(this).property('value')

        ratings = unitsOfAssement.filter((d) => {
            return d.DocumentID == value
        }).map(d => {
            const uoaName = d.UoAString.split(" ").join("").split(",").join("-").toLowerCase()
            return [
                {
                    rating: d.environment["1*"],
                    value: "1*",
                    docID: value,
                    uoaName
                },
                {
                    rating: d.environment["2*"],
                    value: "2*",
                    docID: value,
                    uoaName
                },
                {
                    rating: d.environment["3*"],
                    value: "3*",
                    docID: value,
                    uoaName
                },
                {
                    rating: d.environment["4*"],
                    value: "4*",
                    docID: value,
                    uoaName
                }
            ]
        })

        // Re-render barchart
        barChart.render(ratings[0])
    }

    // creates second dropdown and binds callback `dropDownChildChange`
    let dropDownUOA = d3.select("#uoa-dropdown")
    .insert("select", "svg")
    .on("change", dropDownChildChange)



    // ****************************************************************//
    // *** Init barcharts ***//

    // Init barchart 1 with score for specific UOA
    let barChart = barchart()

    // Init barchart 2 with University scores
    let chart = barchartUOA()

    // Renders UK map
    let map = ukMap(ref14data, context)
}