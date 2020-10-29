let ukMap = (data, context) => {
    myObj = {}

    // Axis and scales
    const width = 400
    const height = 300
    
    myObj.GUP = (coordinates = []) => {
        
        let geo = [coordinates]
        console.log(geo)

        // ADDING THE PINS
        mapGroup.selectAll(".pin")
            .data(geo).enter()
            .append("svg:image")
            .attr("xlink:href", "images/pin.svg")
            .attr("height", "25px")
            .attr("class", ".pin .blink")
            .attr("r", "4")
            .attr("transform", (d) => {
                return "translate(" + projection([
                    +d[0],
                    -100000
                ]) + ")";
            })
            .transition()
                .duration(400)
                .delay((d,i) => i * 15)
                .ease(d3.easeLinear)
            .attr("transform", (d) => {
                return "translate(" + projection([
                    +d[0],
                    +d[1] + .6
                ]) + ")";
            })
            
        mapGroup.exit().remove()
    }

    myObj.GUPdensity = () => {
            // dots Own Generator
        const dots = d3.circleMapGen(data, context)

        mapGroup.selectAll("circle")
            .data(dots).enter()
            .append("circle")
            .attr("class", "density")
            .attr("r", d => 1)
            .attr("cx", d => projection(d.coords)[0])
            .attr("cy", d => projection(d.coords)[1])
            .transition()
                .duration(400)
                .delay((d,i) => i * 15)
                .ease(d3.easeLinear)
            .attr("r", d => d.value)
            .attr("fill", "#f26964")
            .attr("z-index", "9999")
            .attr("opacity", "0.6")

    }
    
    // Container
    const preMapGroup = d3.select(".row-first")
        .append("div")
        .attr("class", "chart-container map-container")
    
    const mapGroup = preMapGroup
        .append("svg")
        .attr("class", "svg-container")

    let toggle = true;
    
    const densityButton = preMapGroup
        .append("button")
        .attr("type", "button")
        .html("Show 4-star density by region")
        .on("click", d =>  myObj.GUPdensity())

    // Add a title
    preMapGroup.insert("h3", ":first-child")
        .attr("class", "title")
        .text("Interactive UK Map with Universities' Locations")

    // Initiates the layout
    const projection = d3.geoAlbers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(500 * 5)
        .translate([width / 2, height / 2]);


    const path = d3.geoPath()
        .projection(projection)
        .pointRadius(2);
        

    d3.json("data/uk.json", (error, uk) => {
    const subunits = topojson.feature(uk, uk.objects.subunits),
        places = topojson.feature(uk, uk.objects.places);

    
    // Country layout
    mapGroup.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path)
        

    // England Border
    mapGroup.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary")
    
    // Ireland Border
    mapGroup.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL")
    

    // Names(labels)
    mapGroup.selectAll(".subunit-label")
        .data(subunits.features)
        .enter().append("text")
        .transition()
            .duration(400)
            .delay((d,i) => i * 15)
            .ease(d3.easeLinear)
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });
    });

    //create zoom handler 
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    //specify what to do when zoom event listener is triggered 
    function zoom_actions(){
        mapGroup.attr("transform", d3.event.transform);
    }

    zoom_handler(preMapGroup)
    return myObj
}
