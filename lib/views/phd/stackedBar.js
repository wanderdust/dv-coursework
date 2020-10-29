/*-------------------------------------------------------------------- 
  
    Module: StackedBar chart class implemented in Michael Stanaland's functional style
    
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Renders the stacked bar chart when there is any seeable university on the dendrogram. 
  
    Dependencies
        D3.js v4   
    
    Reference: 
        http://bl.ocks.org/mstanaland/6100713
---------------------------------------------------------------------- */

let stackedChart = () => {
    // Variables
    myObj = {}
    var margin = {top: 10, right: 100, bottom: 20, left: 40},
    width = 700 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

    // Generates stacked bar chart
    myObj.GUPSTACKED = (dataStacked=[]) =>{
        // Don't show anything if there's no data (seeable universities).
        if(dataStacked.length == 0) return;

        // Initialise stacked bar chart
        var svg = stackGroup;
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set x scale
        var x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1);

        // Set y scale
        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        // Set the colours by me
        var z = d3.scaleOrdinal().range(["#547854", "#7ea11d","#b35900", "#c6972e", "#a05d56", "#b29f00", "#d0743c"]);

        // Formating data to make it 
        dataset = [];
        dataStacked.forEach(function(element) {
            data = {};
            data['UoA'] = element["Institution name"];
            data['4*'] = element["overall"]["4*"];
            data['3*'] = element["overall"]["3*"];
            data['2*'] = element["overall"]["2*"];
            data['1*'] = element["overall"]["1*"];
            data['total'] = data['4*']+data['3*']+data['2*']+data['1*'];
            data['comparing_overall'] = element["comparing_overall"];
            dataset.push(data);
        });

        // Individual stacked bars
        var keys =["4*","3*","2*","1*"];
          
        // Showing data sorted
        dataset.sort(function(a, b) { return b.comparing_overall - a.comparing_overall; });
        
        //Initialising x, y and z domains.
        x.domain(dataset.map(function(d) { return d.UoA; }));
        y.domain([0, d3.max(dataset, function(d) { return d.total; }) + 5]).nice();
        z.domain(keys);

        // Initialising and appending recs for bars
        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(dataset))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.UoA); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function() { tooltip_tool.style("display", null); })
            .on("mouseout", function() { tooltip_tool.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip_tool.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip_tool.select("text").text(d[1]-d[0]);
            });

        // Appending universities name
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")    
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-80)");

        // Appending the scale ruler on the left side
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");

        // Appending the label for each level on the ruler
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", "translate(0,0)")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(37," + i * 20 + ")"; });

        // Appending the bar colours and the attribute
        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        // Initialise tooltip_tool
        var tooltip_tool = svg.append("g")
            .attr("class", "tooltip_tool")
            .style("display", "none");
              
        tooltip_tool.append("rect")
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip_tool.append("text")
            .attr("x", 30)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
    }

    //Cleaning stacked bar chart
    myObj.CLEAN_STACKED = () => {
        d3.select(".stack-container").select(".svg-container-stacked").selectAll("g").remove();
    }

    // Initialise container
    const preStackGroup = d3.select("#stackedChart div").attr("class", "stack-container");

    // Initialise svg
    const stackGroup = preStackGroup.append("svg").attr("class", "svg-container-stacked")
                                    .attr("width", width + margin.left + margin.right)
                                    .attr("height", height + margin.top + margin.bottom);
                                    // .append("g")
                                    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return myObj
}
