/*-------------------------------------------------------------------- 
  
    Module: treemap chart class implemented in Bostock's functional style
    
    Author: Josue Caleb Almaraz Puente
  
    What it does:
        Renders 4 threemaps for England, Scotland, North Ireland, and Wales, with Tier 2 and 5 data for foreigners employability. 
  
    Dependencies
        D3.js v4   
    
    Reference: 
        https://bl.ocks.org/mbostock/8fe6fa6ed1fa976e5dd76cfa4d816fec
---------------------------------------------------------------------- */

// Class (function) which process the data and render the charts. 
let tierChart = (data = []) => {
    
    if(data == []){ return null;}

    myTierObj = {}

    // Receiving data from the model.
    const tiersData = data.tierRecords;

    // Nesting data by region, subtier type and city.
    var tierNested = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.sub; }).key(function(d) { return d.city; }).entries(tiersData);
    
    //Move the 'nest' array into a root node:
    const datasetAsJsonD3Hierarchy = {"key":"United Kingdom", "values": tierNested}
    
    //Now create hierarchy structure 
    function childrenAcessorTier(d){return d.values} //Copy 'values' attributes into "children" attributes 
    const hierarchyTierGraph = d3.hierarchy(datasetAsJsonD3Hierarchy, childrenAcessorTier);
    
    //Main final data's map.
    let tierMap = d3.map([{"key":"United Kingdom", "values":{}}],function(d) { return d.key; })

    // Getting all regions in the data
    let regionTier = []
    hierarchyTierGraph.each(function(node) {
        if(node.depth == 0){
            regionTier = node.data.values;
        }
    }); 

    //Mapping region's data.
    let regionMap = d3.map(regionTier,function(d) { return d.key; })
    //Adding regions as values into main map.
    tierMap.set("United Kingdom",regionMap);

    //Getting subtiers data by regions
    hierarchyTierGraph.each(function(node) {
        if(node.depth == 1){
            let subTier = []
            node.data.values.forEach(element => subTier.push(element));
            let localmap = d3.map(subTier,function(d) { return d.key; })
            let getRegionMap = tierMap.get(node.parent.data.key);
            getRegionMap.set(node.data.key,localmap);
        }
    });

    //Getting cities data by subtiers by regions
    hierarchyTierGraph.each(function(node) {
        if(node.depth == 2){
            let cityTier = []
            node.data.values.forEach(element => cityTier.push(element));
            let localmap = d3.map(cityTier,function(d) { return d.key; }) 
            getRegionMap = tierMap.get(node.parent.parent.data.key);
            let getcityMap = getRegionMap.get(node.parent.data.key);
            getcityMap.set(node.data.key,localmap);
        }
    });  

    // Transforming all mapped data into the following format: {name: ----, children: ----- format}, for treemap chart's functionality. 
    var treemapData = {"name":"UK","children":[] }
    var regions = tierMap.get("United Kingdom"); 
    var regionsLabels = regions.keys();
    regionsLocal = []
    regionsLabels.forEach( function (region_label) {
        regionsLocal.push({"name":region_label,"children":[]})
    });
    treemapData.children = regionsLocal;
    
    // Opted to normalise all regions with same subtier categories in order to display same colours for same labels across the four treemaps
    treemapData.children.forEach( function (region) {
        tierLocal = [{"name":"Tier 2 General", "children":[]}, {"name":"Intra Company Transfers (ICT)", "children":[]}, {"name":"Creative & Sporting", "children":[]}, 
                    {"name":"Religious Workers", "children":[]}, {"name":"Voluntary Workers", "children":[]}, {"name":"Sport", "children":[]}, {"name":"Exchange", "children":[]}, 
                    {"name":"International Agreements", "children":[]}, {"name":"Seasonal Worker", "children":[]}];
        region.children = tierLocal;
    })

    // As the treemap can not be read if it include all the data, we opted to, for England, filter and get data of cities with more than 25 companies.
    treemapData.children.forEach( function (region) {
        region.children.forEach( function (subtier) {
            let cities = []
            if(typeof tierMap.get("United Kingdom").get(region.name).get(subtier.name) !== 'undefined'){
                tierMap.get("United Kingdom").get(region.name).get(subtier.name).keys().forEach(function (city) {
                    if(region.name != "ENG"){
                        cities.push({"name":city,"size":0})
                    }else{
                        if(tierMap.get("United Kingdom").get(region.name).get(subtier.name).get(city).values.length > 25) cities.push({"name":city,"size":0})
                    }
                });
            }
                subtier.children = cities; 
        });
    });

    // Setting cities' number of comnpanies.
    treemapData.children.forEach( function (region) {
        region.children.forEach( function (subtier) {
            subtier.children.forEach(function (city) {
                city.size = tierMap.get("United Kingdom").get(region.name).get(subtier.name).get(city.name).values.length;
            });
        });
    });

    // A Sub treemap of the main treemapData in order to bring the data setting subtier type as last node in the hierarchy; 
    // this means that this data only brings the number of cities under the subtier type.  
    var treemapData_Sub = {"name":"UK","children":[] }
    var regions = tierMap.get("United Kingdom"); 
    var regionsLabels = regions.keys();
    regionsLocal = []
    regionsLabels.forEach( function (region_label) {
        regionsLocal.push({"name":region_label,"children":[]})
    });
    treemapData_Sub.children = regionsLocal;
    

    treemapData_Sub.children.forEach( function (region) {
        tierLocal = []
        tierMap.get("United Kingdom").get(region.name).keys().forEach(function (subtier) {
            tierLocal.push({"name":subtier,"size":0});
        })
        region.children = tierLocal;
    })

    treemapData_Sub.children.forEach( function (region) {
        region.children.forEach( function (subtier) {
            let sum = 0
            tierMap.get("United Kingdom").get(region.name).get(subtier.name).keys().forEach(function (city) {
                sum += tierMap.get("United Kingdom").get(region.name).get(subtier.name).get(city).values.length;
            });
            subtier.size = sum;
        });
    });

    // Data all data (from treemapData) grouped by region.
    var dataByRegion = {}
    treemapData.children.forEach(function (region) {
        dataByRegion[region.name] = {"name":region.name,"children":[]};
        let childrens = []
        region.children.forEach(function (tier) {
            childrens.push(tier);
        })
        dataByRegion[region.name].children = childrens;
    })

    
    // Initialises and calls to draws the four treemaps
    myTierObj.tierTreeMap = () => {
        // Setting list of countries to loop over them and render a map for each of them.
        countries = ['ENG','SCT','NIR','WLS'] 
        countries.forEach( function (country) {
            let newroot = {"name":"UK","children":[] };
            newroot.children = [dataByRegion[country]];
            draw(false,newroot,country);
        });

    }    

    // Draws the maps
    function draw(updating,dataToMap,domElement){
        // Variables for chart sizes.
        const margin = {top: 40, right: 10, bottom: 10, left: 10},
        width = 650 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom,
        // Colours selected by me.
        colour = d3.scaleOrdinal().range(['#7bb8b4', '#314d5e', '#493d5c', '#94384d', '#dc7582', '#8a8a8a', '#e7e7e7', '#efca51', '#5c8437']);

        //Initialises SVG DOM element
        const svg = d3.select("."+domElement).append("svg")
                .style("width", (width + margin.left + margin.right) + "px")
                .style("height", (height + margin.top + margin.bottom) + "px")
                .style("left", margin.left + "px")
                .style("top", margin.top + "px");

        var tooltip_tool = d3.select("."+domElement)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")


        svg.style("width", (width + margin.left + margin.right) + "px")
            .style("height", (height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px");

        // Gives the data to the cluster layout if it is not empty:
        if(dataToMap.length !=0){
            var  root = d3.hierarchy(dataToMap, (d) => d.children).sum((d) => d.size); // Here the size of each leave is given in the 'value' field in input data
        }else{
            var  root = d3.hierarchy(treemapData, (d) => d.children).sum((d) => d.size); // Here the size of each leave is given in the 'value' field in input data
        }

        // D3 treemap computes all the position for each element of the hierarchy
        var  treemap = d3.treemap().size([width, height]).padding(.5).tile(d3.treemapSquarify);

        //Initialises chart with hierarchy structure
        var treeMP = treemap(root);

        //Initialises rectangles and submit hierarchy leaves.
        const rects = svg.selectAll(".rect").data(treeMP.leaves());

        //Updating was thinked for any update on the charts but we better let single charts.
        if(updating){
            rects.exit().remove();

            rects.attr("transform", d => 'translate('+d.x0+','+d.y0+')')
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0);
        }else{
            //Remove current rects
            rects.exit()
                .style("opacity", 1)
                .transition().duration(1500)
                .style("opacity", 1e-6)
                .remove();

            // Ready to add new rects
            rects.transition().duration(1500)
                .attr("transform", d => 'translate('+d.x0+','+d.y0+')')
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0);

        }

        // Entering data and appending rects:
        rects.enter()
            .append("rect")
            .on("mouseover", function(){return tooltip_tool.style("visibility", "visible");})
            .on("mousemove", function (d) {
                                        //Initialises a tooltip for each rect with region, number of companies and city, and subtier category.
                                        tooltip_tool.style("top", d3.event.pageY - 20 + "px")
                                        .style("left", d3.event.pageX + 10 + "px");
                                        let article = d.data.size>1? "are": "is";
                                        let comapanies = d.data.size>1? "companies": "company";
                                        tooltip_tool.html(d.children ? null :   "In <b>"+d.parent.parent.data.name+ "</b>, there "+article+" <b>" + d.data.size + 
                                                "</b> "+comapanies+" in <b>"+d.data.name + "</b> that can provide the <b>" +
                                                d.parent.data.name+"</b> visa.")
                                        })
            .on("mouseout", function(){return tooltip_tool.style("visibility", "hidden");})
            .attr("class", "rect")
            .style("fill", d => colour(d.parent.data.name))
            .attr("transform", d => 'translate('+d.x0+','+d.y0+')')
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .style("opacity", 1e-6)
            .transition().duration(1500)
            .style("opacity", 1);

        // Adding labels to all the rects. Here we are only displaying the total number of companies per rectangle. 
        const labels = svg.selectAll(".label").data(treeMP.leaves());
        
        if(updating){
            labels.exit().remove();

            labels.html(d => d.data.size)
                .attr("transform", d => 'translate('+d.x0+','+d.y0+')');  
        }else{
            // Cleaning current labels
            labels.exit()
                .style("opacity", 1)
                .transition().duration(1500)
                .style("opacity", 1e-6)
                .remove();

            // Getting ready to add new labels
            labels
                .html(d => d.data.size)
                .transition().duration(1500)
                .attr("transform", d => 'translate('+d.x0+','+d.y0+')'); 
        }

        // Entering data and appending text with new labels
        labels.enter().append("text")
            .attr("class", "label")
            .attr("dy", 10)
            .attr("dx", 0)
            .attr("transform", d => 'translate('+d.x0+','+d.y0+')')
            .html(d => d.data.size)
            .style("opacity", 1e-6)
            .transition().duration(1500)
            .style("opacity", 1);
    }

    return myTierObj;
}

