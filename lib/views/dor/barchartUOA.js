let barchartUOA = () => {
    let obj = {}

    // Axis and scales
    const width = 400
    const height = 300
    const max = 100

    // Axis and scales
    let rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0,7]);
    let interpolate = d3.interpolateRgb("yellow", "purple")

    const mouseOver = d => {
        d3.selectAll(".a" + d.uoaName)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
    }

    const mouseOut = d => {
        d3.selectAll(".a" + d.uoaName)
        .attr("stroke", "black")
        .attr("stroke-width", "0px")
    }

    obj.GUP = (data, provider) => {
        // BIND
        const values = data.values.map(d => ({...d, uoaName: d.UoAString.split(" ").join("").split(",").join("-").toLowerCase()}))
        let barchart = barChartGroup.selectAll("rect")
            .data(values);

        // ENter Selection
        barchart.enter().append("rect")
            .classed("enterSelection bars", true)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .attr("class", d => "a" + d.uoaName)
            .attr("value", ""+ data.key)
            .attr("x", (d,i) => i*(width/data.values.length))
                .transition()
                .duration(750)
                .delay((d,i) => i * 15)
            .attr("y", (d) => height - d.overall["4*"]*3)
            .attr("height", (d) => d.overall["4*"]*3)
            .attr("width", (d) => 0.8*(width/data.values.length))
            .attr("fill",function(d,i){ return rainbow(i)})

        // UPDATE SELECTION
        barchart.classed("enterSelection", false)
            .classed("updateSelection", true)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
                .attr("x", (d,i) => i*(width/data.values.length))
                    .transition()
                    .duration(750)
                    .delay((d,i) => i * 15)
                .attr("y", (d) => height - d.overall["4*"]*3)
                .attr("height", (d) => d.overall["4*"]*3)
                .attr("width", (d) => 0.8*(width/data.values.length))
                .attr("fill", '#f26b7f')
                

        
        // let merged = barchart.merge(enterSelection)

        barchart.exit()
            .classed("enterSelection updateSelection", false)
            .classed("exitSelection", true)
            .remove()

        // ADD axis
        let domain = data.values.map(d => d["UoAString"])

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
            .text(lowerCase(provider) + "'s Environmental 4-star Ratings")
    }



    
    let margin = {left:50,right:50,top:40,bottom:0};

    let preSVG = d3.select(".row-second")
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
            

    return obj
}