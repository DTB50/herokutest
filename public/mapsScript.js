
	/////////////////////////////////////////////////////////////////////////////////////////////		
    //INITIAL PAGE SETUP: HAPPENS ON LOAD -------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
            
            //Initial variables
            var year = 2000;
            var newYear;
            displayYear();
            var map;

             ////////////////////////////////////////////////////////////
            //  BAR CHART  /////////////////////////////////////////////
            ////////////////////////////////////////////////////////////
            $.get("/users/ufosChartData/", function(data, status){
                console.log("ALL SIGHTINGS");
                console.log(data);
                
            //VISUALISE DATA
                
                //give svg a class and style it
                var svgWidth = 500;
                var svgHeight = 100;
                var svg = d3.select('svg')
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("class", "bar-chart");
                
                //place div for tooltips
                var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
                var dataset = data;
                
                //make a bar chart based on that data
                var barPadding = 3;
                
                //define width of each bar (depending how many fit into the svg)
                var barWidth = (svgWidth / dataset.length);
                
                //add bar elements - for each element, make the height a factor of the number of sightings
                var barChart = svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("y", function(d) {
                        return svgHeight - (d.sightingCount*2)
                    })
                    .attr("height", function(d) {
                        return (d.sightingCount*2);
                    })
                    .attr("width", barWidth - barPadding)
                    .attr("class", "bar")
                    .attr("transform", function (d, i) {
                         var translate = [barWidth * i, 0];
                         return "translate("+ translate +")";
                    })
                    //add tooltip containing year and number of sightings
                    .on("mouseover", function(d) {
                       div.transition()
                         .duration(200)
                         .style("opacity", .9);
                       div.html("Year: " + (d.year) + "<br/>" + "Sightings: " + d.sightingCount)
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
                       })
                     .on("mouseout", function(d) {
                       div.transition()
                         .duration(500)
                         .style("opacity", 0);
                       })
                    //change year on click
                    .on("click", function(d){
                        newYear = d.year
                        reload(newYear);
                    })
                    //change color of bar on mouseover
                });
  
            //////////////////////////////////////////////////////////////
            //  MAP  /////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////
            
            //set up map elements
            //add open street map element to div
            map = L.map('map').setView([55.9531, -3.1889], 5);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{
                attribution: '&copy; <a href="href://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);


            var myIcon = L.icon({
                iconUrl: 'images/ufo.png',
                iconSize: [30, 30],
                iconAnchor: [0, 30],
                popupAnchor: [0, 20],
            });
            
            //on load, place markers for all UK-based sightings in the year 2000
            var currentLayer;

            //make a new layer group
            var markersLayer = new L.LayerGroup();

            //fill the layer with UFO elements for each UK-based UFO sighting
                var marker;

            //request data from server
            var receivedData; 
            
            $.get("/users/ufos/", function(data, status){
                console.log(data);
                gotData = data;

                //update the sightings count
                console.log("INITIAL SIGHTING COUNT: " + sightings)
                displaySightings(sightings);
                
                //place markers for all filtered data elements using UFO icon
                console.log("BEFORE DATA BINDING");
                console.log(gotData);
                gotData.forEach(function(d){
                    var markerText = "City" + d.city;
                    marker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map)
                    .bindTooltip("<b>City: </b>"  + d.city.substring(0, d.city.indexOf("("))  + "<br><b>Type: </b>" + d.shape);
                    currentLayer = L.marker([d.latitude, d.longitude], {icon: myIcon});
                    markersLayer.addLayer(marker); 
                    markersLayer.addTo(map);
                });
            });
//            var sightings = recievedData.length;

            
//          reload(year);

            
    ////////////////////////////////////////////////////////////////////////////////////////////
    //  SUPPORTING FUNCTIONS -------------------------------------------------------------------
    ////////////////////////////////////////////////////////////////////////////////////////////     
            function reload(inputYear) {
                
                year = inputYear;
                
                //on the client side, reset necessary elements and variables
                console.log("changing year to " + year);
                displayYear();
                var sightings = 0;
                var currentLayer;
                markersLayer.remove();
                markersLayer.clearLayers(); 
                
                //send the request to the server
                $.post("/users/ufosUpdate",{year: inputYear}, function(data){
                        console.log(data);
                        gotData = data;

                    //on load, place markers for all UK-based sightings in the year 2000
                    //update the sightings count
                    console.log("INITIAL SIGHTING COUNT: " + sightings)
                    displaySightings(sightings);

                    //place markers for all filtered data elements using UFO icon
                    console.log("BEFORE DATA BINDING");
                    console.log(gotData);
                    gotData.forEach(function(d){
                        var markerText = "City" + d.city;
                        marker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map)
                        .bindTooltip("<b>City: </b>"  + d.city.substring(0, d.city.indexOf("("))  + "<br><b>Type: </b>" + d.shape);
                        currentLayer = L.marker([d.latitude, d.longitude], {icon: myIcon});
                        markersLayer.addLayer(marker); 
                        markersLayer.addTo(map);
                    });
                });
            };
                
            
            //AUGMENT YEAR
            
            function changeYear(direction) {
                if (direction == "plus"){
                    newYear = year+=1;
                    console.log("ADDYEAR ACTIVATED: year is now " + newYear);
                    reload(newYear);
                }
                else if (direction == "minus"){
                    newYear = year-=1;
                    console.log("MINUSYEAR ACTIVATED: year is now " + newYear);
                    reload(newYear);
                }
            };
            
            //UI ELEMENT DISPLAY
            
            function displayYear() {
                console.log("displaying year = " + year);
                document.getElementById("year").innerHTML = year;
            };
            
            function displaySightings(sightings) {
                console.log("sightings: " + sightings);
                document.getElementById("sightings").innerHTML = "Sightings: " + sightings;
            };
            