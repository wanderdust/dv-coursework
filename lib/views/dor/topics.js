let topicSimilarity = (data) => {
    let myObj = {}

    let size = {height: 900, width: 900}

    let rainbow = d3.scaleOrdinal(d3.schemeCategory20)
    
    const preChartGroup = d3.selectAll(".topics")
        .attr("height", d => size.height)

    const chartGroup = preChartGroup
        .insert("svg", ":first-child")
        .attr("class", "svg-container")

    // Add a title
    let title = preChartGroup.append("h3")
        .attr("class", "title")
        

        
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

        enter.append('circle')
            .attr("value", ""+ data.key)
                .on("click", function(d) {
                    const area = d
                    console.log(area)

                })
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .transition()
                    .duration(750)
                    .delay((d,i) => i * 2)
                .attr('r', function(d) { return d.r; })
                .attr("fill", (d,i) =>rainbow(i))

        enter.append("g")
            .attr("transform", d => {
                let yOffset = 20;
                let xOffset = 50;

                if (d.depth == 0) {
                    return `translate(${d.x},${d.y - 350})`
                } else if (d.depth == 1) {
                    return `translate(${d.x - xOffset},${(d.y + d.r)-35})`
                } else if (d.depth == 2) {
                    return `translate(${d.x - xOffset},${d.y - yOffset})`
                }
            })
            .append("path")
            .attr("d", hexagon)
            .attr("transform", d=> `scale(.1)`)
            .attr("fill", "#3c7984")

        let textOffset = 30
        
        let enterText = enter.append("text")
            .attr("x", d => d.x -textOffset)
            .attr("y", d => {
                if (d.children == undefined) {
                    return d.y - 20
                } else {
                    return (d.y + d.r) - 38
                }
            })

        // LABELS
        enterText.append("tspan")
            .text(d => d.data.name.split("-")[0])
            .attr("font-family", "sans-serif")
            .attr("height", "20px")
            .attr("font-size", "1.4em")
            .attr("dy", "0em")

        // LABELS
        enterText.append("tspan")
            .text(d => d.data.name.split("-")[1])
            .attr("font-family", "sans-serif")
            .attr("height", "20px")
            .attr("font-size", "1.4em")
            .attr("dy", "1em")
            .attr("x", d => d.x - textOffset)

        // LABELS
        enterText.append("tspan")
            .text(d => d.data.name.split("-")[2])
            .attr("font-family", "sans-serif")
            .attr("height", "20px")
            .attr("font-size", "1.4em")
            .attr("dy", "1.2em")
            .attr("x", d => d.x - textOffset)


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
            .text("Topic Similarity")
    }
    return myObj
  }