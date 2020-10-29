let barchart = () => {
    let obj = {}

    obj.render = (data) => {
        GUP(data)
    }

    obj.renderTitle = d => {
        GUPTitle(d)
    }

    // Axis and scales
    const width = 400
    const height = 300
    const max = 100

    // Axis and scales
    let rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0,7]);

    let GUPTitle = provider => {
        title
            .html("")
            .text("Environmental Unit of Assessment Ratings at "+ lowerCase(provider))
    }

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

    

    let GUP = (data) => {
        // BIND
        let barchart = barChartGroup.selectAll("rect")
            .data(data);

        // ENter Selection
        barchart.enter().append("rect")
            .classed("enterSelection bars", true)
            .attr("class", d => "a" + d.uoaName)
            .attr("foo",  d => console.log(d))
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .attr("x", (d,i) => i*(width/data.length))
                .transition()
                .duration(750)
                .delay((d,i) => i * 15)
            .attr("y", (d) => height - d.rating*3)
            .style("fill", "#a4cafd")
            .attr("height", (d) => d.rating*3)
            .attr("width", (d) => 0.8*(width/data.length))
            .attr("fill",function(d,i){ return rainbow(i)})

        // UPDATE SELECTION
        barchart.classed("enterSelection", false)
            .classed("updateSelection", true)
            .attr("class", d => "a" + d.uoaName)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
                .attr("x", (d,i) => i*(width/data.length))
                    .transition()
                    .duration(750)
                    .delay((d,i) => i * 15)
                .style("fill", "#f26b7f")
                .attr("y", (d) => height - d.rating*3)
                .attr("height", (d) => d.rating*3)
                .attr("width", (d) => 0.8*(width/data.length))

        
        // let merged = barchart.merge(enterSelection)

        barchart.exit()
            .classed("enterSelection updateSelection", false)
            .classed("exitSelection", true)
            .style('fill', '#f58b77')
            .remove()        
    }

    let y = d3.scaleLinear()
                .domain([0, max])
                .range([height, 0])

    let x = d3.scaleBand()
                .domain(["1*", "2*", "3*", "4*"])
                .range([0, width]);

    let yAxis = d3.axisLeft(y)
    let xAxis = d3.axisBottom(x)
    
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

    barChartGroup.append("g").attr("class", "x axis").attr("transform","translate(0,"+height+")").call(xAxis)
    barChartGroup.append("g").attr("class","y axis").call(yAxis);



    return obj
}