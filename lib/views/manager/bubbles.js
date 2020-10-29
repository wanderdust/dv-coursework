let tree = (unis) => {
    let myObj = {}

    let size = {height: 400, width: 400}

    let rainbow = d3.scaleOrdinal(d3.schemeCategory20);
    
    const preChartGroup = d3.selectAll(".bubbles")
        .attr("height", d => size.height)

    const chartGroup = preChartGroup
        .insert("svg", ":first-child")
        .attr("class", "svg-container")

    // Add a title
    let title = preChartGroup.append("h3")
        .attr("class", "title")
        
        
    // Tooltip witht text
    var tooltip = d3.select("body").append("div")	
        .attr("id", "tooltip")
        .attr("class", "hidden")
        .style("position", "absolute")
        .style("z-index", "10")
        .text("a simple tooltip");
        
    myObj.GUP = (data, buttonText="Overall") => {
        // PAck data into bubbles
        let pack = data => d3.pack()
            .size([size.width - 2, size.height - 2])
            .padding(3)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))

        let root = pack(data)

        // Data binding
        let bubbleChart = chartGroup
            .selectAll('circle')
            .data(root.descendants())

        // Enter selection
        let enter = bubbleChart.enter()

        let circle = enter.append('circle')
            .attr("value", ""+ data.key)
                .on("mouseover", function(d) {
                    d3.select("#tooltip")
                        .classed("hidden", false)
                        .text(d.data.name)

                    return  tooltip.style("top", (d3.event.pageY-10)+"px") 
                    .style("left",(d3.event.pageX+10)+"px"); 
                })					
                .on("mouseout", function(d) {		
                    d3.select("#tooltip").classed("hidden", true)	
                })
                .on("click", function(d) {
                    const area = d.data.name
                    const uni = unis.filter(d => area == d.region)

                    chart.GUP(uni, area)

                })
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .transition()
                    .duration(750)
                    .delay((d,i) => i * 2)
                .attr('r', function(d) { return d.r; })
                .attr("fill", (d,i) =>rainbow(i))
        
            enter.append("text")
                .attr("x", d => d.x -20)
                .attr("y", d => d.y)
                .text(d => d.data.name)

        // UPdate selection
        bubbleChart.classed("enterSelection",false)
                .classed("updateSelection", true)
                .transition()
                    .duration(750)
                    .delay((d,i) => i * 2)
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('r', function(d) { return d.r; })
                .attr("fill", (d,i) =>rainbow(i))

        bubbleChart.exit()
            .classed("exitSelection", true)
            .classed("enterSelection updateSelection", true)
            .remove()

        // Add title 
        title
            .text("Averaged "+buttonText+" 4-Star Ratings per Unit of Assessment in UK Regions")
    }
    return myObj
  }