let barchart = () => {
    let obj = {}

    // Axis and scales
    const width = 400
    const height = 300
    const max = 100


    // Tooltip witht text
    var tooltip = d3.select("body").append("div")	
        .attr("id", "tooltip")
        .attr("class", "hidden")
        .style("position", "absolute")
        .style("z-index", "10")
        .text("a simple tooltip");
    // Axis and scales
    let rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0,7]);

    obj.GUP = (data, provider="some title") => {
        console.log(data)
        // BIND
        let barchart = barChartGroup.selectAll("rect")
            .data(data);

        // ENter Selection
        barchart.enter().append("rect")
            .classed("enterSelection bars", true)
            .on("click", d => pie.GUP(d))
            .attr("value", ""+ data.key)
            .attr("x", (d,i) => i*(width/data.length))
                .transition()
                .duration(750)
                .delay((d,i) => i * 15)
            .attr("y", (d) => height - d.value*3)
            .attr("height", (d) => d.value*3)
            .attr("width", (d) => 0.8*(width/data.length))
            .attr("fill",function(d,i){ return rainbow(i)})

        // UPDATE SELECTION
        barchart.classed("enterSelection", false)
            .classed("updateSelection", true)
                .attr("x", (d,i) => i*(width/data.length))
                    .transition()
                    .duration(750)
                    .delay((d,i) => i * 15)
                .attr("y", (d) => height - d.value*3)
                .attr("height", (d) => d.value*3)
                .attr("width", (d) => 0.8*(width/data.length))

        
        // let merged = barchart.merge(enterSelection)

        barchart.exit()
            .classed("enterSelection updateSelection", false)
            .classed("exitSelection", true)
            .remove()

        // ADD axis
        let domain = data.map(d => d["name"])

        let y = d3.scaleLinear()
            .domain([0, max])
            .range([height, 0])

        let x = d3.scaleBand()
            .domain(domain)
            .range([0, width]);

        let xAxis = d3.axisBottom(x)

        let yAxis = d3.axisLeft(y)

        yGroup.call(yAxis)

        xGroup.call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")

        title
            .html("")
            .text(`Universities in ${lowerCase(provider)}`)
    }


    obj.GUPLine = (ypos) => {
        d3.selectAll(".line")
            .remove()
        d3.selectAll(".chart-text")
            .remove()

        barChartGroup.append("line")
        .attr('class', 'line')
        .attr("x1", 0)
        .attr("x2", width)
        .transition()
            .duration(750)
            .delay((d,i) => i * 15)
        .attr("y1", height - ypos*3)
        .attr("y2", height - ypos*3)
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("z-index", "99")
        
        barChartGroup.append("text")
            .attr("class", "chart-text")
            .attr("x", d => width + 5)
            .transition()
                .duration(750)
                .delay((d,i) => i * 15)
            .attr("y", d => (height - ypos*3)+5)
            .text(d => `${Math.round(ypos * 100)/100}%`)
    }
    
    let margin = {left:50,right:50,top:40,bottom:0};

    let preSVG = d3.select(".row-first")
        .append("div")
        .attr("class", "chart-container barchart-top")

    // Add title to the chart
    let title = preSVG.append("h3")
        .attr("class", "title")
        

    // Create the svg
    let svg = preSVG
        .append("svg")
        .attr("class", "svg-container")
    
    // Create a group inside the svg
    let barChartGroup = svg.append('g')
                .attr("class", "barchart chart")
                .attr("transform","translate("+margin.left+","+margin.top+")")
                .attr("width", () => width);

    let xGroup = barChartGroup.append("g").attr("class", "x axis").attr("transform","translate(0,"+height+")")
    let yGroup = barChartGroup.append("g").attr("class","y axis");
    
    const pie = pieChart()

    return obj
}