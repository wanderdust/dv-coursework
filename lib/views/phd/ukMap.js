let ukMap = () => {
    myObj = {}

    // Axis and scales
    const width = 400;
    const height = 300; 
    dataset = [];

    myObj.GUP = (coordinates = [], region = "", country = "", ukprn = "", rank = "", uni_name = "", overall = "", data = []) => {

        if(overall == ""){overall = {o_four: 0, o_three: 0, o_two: 0, o_one: 0};}

        let geo = [coordinates]

        // ADDING THE PINS
        mapGroup.selectAll(null)
            .data(geo).enter()
            .append("svg:image")
            .attr("xlink:href", "images/pin.svg")
            .attr("height", "10px")
            .attr("class", "pin .blink "+country)
            .attr("r", "4")
            .attr("ukprn",ukprn)
            .attr("region",region)
            .attr("country",country)
            .attr("rank",rank)
            .attr("uni_name",uni_name)
            .attr("o_four",overall['4*'])
            .attr("o_three",overall['3*'])
            .attr("o_two",overall['2*'])
            .attr("o_one",overall['1*'])
            
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

    // Cleaning all pins
    myObj.CLEAN_MAP = () => {
        d3.select(".svg-container").selectAll(".pin").remove();
    }

    // Container
    const preMapGroup = d3.select(".row-first")
        .append("div")
        .attr("class", "chart-container map-container")
    
    const mapGroup = preMapGroup
        .append("svg")
        .attr("class", "svg-container")

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

    // dots
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
        .attr("id", function(d) { return d.id; })
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

    // Getting map boundries
    const mapboundries = mapGroup.node().getBoundingClientRect();

    const brush = d3.brush()                                                        // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [mapboundries.width,mapboundries.height] ] )      // Initialise the brush area: start at 0,0 and finishes at width,height from boundries
                .on("end", brushed);

    // Function to initialise brush tool
    myObj.BRUSH= (data) => {
        dataset = data;
        
        mapGroup.append("g")
            .attr("class", "brush")
            .call(brush);
    }

    // Brush functionality. Gets all pins (nodes) between brush boundries and display this data as dataset_ranked.
    function brushed() {
        var t = 0;
        var pins_brushed = new Array();
        var extent = d3.event.selection;

        if(!extent){return;}

        var x0 = extent[0][0],
            y0 = extent[0][1],
            x1 = extent[1][0],
            y1 = extent[1][1];

        let images = new Array();
        let select = mapGroup.selectAll("image").each(function(d,i) { 
            let pin_matrix = this.transform.baseVal.consolidate().matrix;
            let pin_trans_x = pin_matrix['e'];
            let pin_trans_y = pin_matrix['f'];
             
            if (x0 <= pin_trans_x && pin_trans_x <= x1 && y0 <= pin_trans_y && pin_trans_y <= y1){
                t += 1;
                pins_brushed.push(this.attributes)  
            } 
        });


        rankingUniversitiesBrushed(pins_brushed);

        // Set brush tool hidden (covering all map boundries) once again.
        mapGroup.call( d3.brush()                                                   // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [mapboundries.width,mapboundries.height] ] )      // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("brush", brushed)
              );
    }


    return myObj
}
