const pieChart = () => {

    let obj = {}

    const width = 400;
    const height = 400;
    const margin = 50;


    obj.GUP = (data) => {
        
        let dataset = data.uoas
        console.log(dataset)
        const color = d3.scaleOrdinal()
        .domain(dataset)
        .range(['#F1892D', '#0EAC51', '#0077C0', '#7E349D', '#DA3C78', '#E74C3C'])
        
        const pie = d3.pie()
            .value((d) => d.value)

        const arc = d3.arc()
            .innerRadius(100)
            .outerRadius(200)

        const part = g.selectAll('.part')
            .data(pie(d3.entries(dataset)))
            

        // Enter
        let enterSelection = part.enter()
            .append('g')

        enterSelection.append('path')
        .attr('fill', "white")
        .attr('d', arc)
                .transition()
                .duration(750)
                .delay((d,i) => i * 15)
            .attr('fill', (d, i) => color(i))
            .attr("class", "arc")

        enterSelection.append("text")
            .attr('transform', (d) => 'translate(' + arc.centroid(d) + ')')
            .text((d) => d.data.key)
            .attr('fill', 'white')
            .attr('class', 'pietext')


        // UPDATE SELECTION
        part.attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .attr("class", "arc")

        part.exit().remove()


        title
            .html("")
            .text(`${data.name} Pie chart `)
    }

    let preSVG = d3.select(".row-second")
        .append("div")
        .attr("class", "chart-container piechart")

    // Add title to the chart
    let title = preSVG.append("h3")
        .attr("class", "title")
        
    // Create the svg
    let svg = preSVG
        .append("svg")
        .attr("class", "svg-container")
    
    svg.attr('width', width + margin + margin)
        .attr('height', height + margin + margin)

    const g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    return obj
}