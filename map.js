// Pacific Tectonic Plate and its surrounding.  
// A map by Kadek Satriadi. 2022. 

 //properties
 var width = 1300;
 var height = 800;
 var projRotation = [-200,0]
 var projection = d3.geoEqualEarth().rotate(projRotation).translate( [width / 2, height / 2]).scale(200); //.clipAngle(120).
 var projPath = d3.geoPath().projection(projection);

 //variables
 var svg = d3.select("#vis");
 svg.attr("width", width).attr("height", height);
 // tooltip
 var div = d3.select("body").append("div")	
     .attr("class", "tooltip")				
     .style("opacity", 0);


 //load data
 queue()
   .defer(d3.csv, "./data/GVP_Volcano_List_Holocene.csv")
   .defer(d3.json, "./data/world-110m.geojson")
   .defer(d3.json, "./data/plates_no_pacific.geojson")
   .defer(d3.json, "./data/plates_bound_subduction.geojson")
   .defer(d3.json, "./data/PB2002_boundaries.json")
   .defer(d3.json, "./data/ocean_200.geojson")
   .defer(d3.json, "./data/ocean_1000.geojson")
   .defer(d3.json, "./data/ocean_2000.geojson")
   //.defer(d3.json, "./data/ocean_3000.geojson") disabled to optimise the web page
   //.defer(d3.json, "./data/ocean_4000.geojson")
   //.defer(d3.json, "./data/ocean_5000.geojson")
   //.defer(d3.json, "./data/ocean_6000.geojson")
   //.defer(d3.json, "./data/ocean_7000.geojson")
   //.defer(d3.json, "./data/ocean_8000.geojson")
   //.defer(d3.json, "./data/ocean_9000.geojson")
   //.defer(d3.json, "./data/ocean_10000.geojson")
   .await(ready);

 //visualise
 function ready(error, 
 volcanoData,
 worldData, 
 platesNoPacificData, 
 boundSubductionData, 
 boundData,
 oceanData200,
 oceanData1000,
 oceanData2000,
 //oceanData3000,
 //oceanData4000,
 //oceanData5000
 //oceanData6000,
 //oceanData7000,
 //oceanData8000,
 //oceanData9000,
 //oceanData10000
 )
 {


   //ocean
   visualiseGeojson(oceanData200, "ocean1000");
   visualiseGeojson(oceanData1000, "ocean2000");
   visualiseGeojson(oceanData2000, "ocean3000");
   //visualiseGeojson(oceanData3000, "ocean3000");
   //visualiseGeojson(oceanData4000, "ocean4000");
   //visualiseGeojson(oceanData5000, "ocean5000");
   //visualiseGeojson(oceanData6000, "ocean6000");
   //visualiseGeojson(oceanData7000, "ocean7000");
   //visualiseGeojson(oceanData8000, "ocean8000");
   //visualiseGeojson(oceanData9000, "ocean9000");
   //visualiseGeojson(oceanData10000, "ocean10000");
   
   //countries
   visualiseGeojson(worldData, "country");
   //all plates but pacific
   visualiseGeojson(platesNoPacificData, "other-plate", 
   function(d) {
       //console.log("just had a mouseover", d3.select(d));
       //console.log(d);
       //console.log(d.properties.PlateName);
      d3.select(this)
        .classed("active", true);       
      
       div.transition()		
           .duration(200)		
           .style("opacity", .9);		
       div	
           .html(
             "<b><h3>" + d.properties.PlateName + " plate</h3></b>"
           )
           .style("left", (d3.event.pageX + 20) + "px")		
           .style("top", (d3.event.pageY - 100) + "px");	
     }, 
   function(d){
       //  console.log("just had a mouseleave", d3.select(d));
         d3.select(this)
         .classed("active",  false);
         div.transition()		
           .duration(500)		
           .style("opacity", 0);	
   });
   //all plate boundaries
   visualiseGeojson(boundData, "bound")
   //subduction lines
   visualiseGeojson(boundSubductionData, "subduction-line");
   //volcano
   visualiseVolcano(volcanoData, "volcano", "Latitude", "Longitude");
    //update title position
    updateTitlePosition();
 }

 //update title position
 function updateTitlePosition()
 {
  var center = projection([-95, 10]);
  var left = center[0]; 
  var top = center[1]; 
  d3.select("#title-container")
    .style("position", "absolute")
    .style("left", left + "px")
    .style("top",  top + "px");
 
 }

 //add plates labels
 function addPlatesLabels(svg, platesNoPacificData){
   svg.append("g")
   .selectAll("text")
   .data(platesNoPacificData.features)
   .enter()
   .append("text")
   .attr("x", function(d){
     var center = getGeometryCenterPoint(d, projection);
     return center[0];
   })
   .attr("y", function(d){
     var center = getGeometryCenterPoint(d, projection);
     return center[1];
   })
   .attr("dy", ".35em")
   .text(function(d) { return d.properties.PlateName; });

 }


 ///visualise volcano data
 function visualiseVolcano(data, svgClass, lat, long){
   svg.append("g")
    .selectAll("polygon")
     .data(data)
   .enter().append("polygon")
     .attr("points", function(d){
         var center = projection([
          d[long], d[lat]
        ]);
        var x = center[0];
        var y = center[1];
        var length = 5;
        var topPoint = [x, y - length];
        var leftPoint = [x + length, y ];
        var rightPoint = [x - length, y ];
       var ret = topPoint.toString() + " " + rightPoint.toString() + " " + leftPoint.toString();
       return ret;
     }) 
     .on("mouseover", function(d) {		
       div.transition()		
           .duration(200)		
           .style("opacity", .9);		
       div	
           .html(
             "<b>" + d["Volcano Name"] + "</b><br/>" +
             "Country: " + d["Country"] + "<br/>" +
             "Primary volcano type: " + d["Primary Volcano Type"] + "<br/>" +
             "Last known eruption was "+ d["Last Known Eruption"] + " ago.<br/>" +
             "Activity evidence: <i> " + d["Activity Evidence"] + "</i><br/>" 
           )
           .style("left", (d3.event.pageX + 20) + "px")		
           .style("top", (d3.event.pageY - 100) + "px");	
       })					
   .on("mouseout", function(d) {		
       div.transition()		
           .duration(500)		
           .style("opacity", 0);	
   })        
   .attr("class", svgClass);
 }

 //visualise geojson data
 function visualiseGeojson(data, svgClass, onMouseOver, onMouseOut){
   svg.append("g")
   .selectAll("path")
   .data(data.features)
   .enter().append("path")
   .attr("d", projPath)
   .attr("class", svgClass)
   .on("mouseover", onMouseOver)
   .on("mouseout", onMouseOut);
 }

 //get label position
 function getGeometryCenterPoint(data, projection){
   //console.log(data);
   //calculate center of geometry
   var sumX = 0;
   var sumY = 0;
   var nTotal = 0;
   var nPoly = data.geometry.coordinates.length;

   //traverse coordinates
   for(var i = 0; i < nPoly; i++){
     var n = data.geometry.coordinates[i].length;
     nTotal += n;
     //traverse points
     for(var j = 0; j < n; j++){
       var latLon = data.geometry.coordinates[i][j];
       var xy = projection([
             latLon[0], latLon[1]
         ]);
       sumX += xy[0];
       sumY += xy[1];
     }
   }
  
   return [sumX/nTotal, sumY/nTotal];
 }
