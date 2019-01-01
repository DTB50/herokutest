
	/////////////////////////////////////////////////////////////////////////////////////////////		
    //INITIAL PAGE SETUP: HAPPENS ON LOAD -------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
            
            //Initial variables
            var year = 2000;
            var newYear;
            displayYear();
            var map;

  
            //////////////////////////////////////////////////////////////
            //  MAP  /////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////
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
            

            //request data from server
            var receivedData; 
            
            $.get("/users/ufos/", function(data, status){
                console.log(data);
                gotData = data;

                //on load, place markers for all UK-based sightings in the year 2000
                var currentLayer;

                //make a new layer group
                var markersLayer = new L.LayerGroup();

                //fill the layer with UFO elements for each UK-based UFO sighting
                var marker;

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
                
                
                //reset data and display layers
                console.log("changing year to " + year);
                displayYear();
                var sightings = 0;
                var currentLayer;
                markersLayer.remove();
                markersLayer.clearLayers(); 

            
                
                d3.csv(dataPath, function(error, data){
                    var myData = data;
                    console.log(data);
                    var myDataParsed = [];
                //parse the data by the filter category
                    myData.forEach(function(d){
                        if (d.country == "gb" && d.datetime.substr(6, 4) == year){
                            sightings+=1;
                            myDataParsed.push(d);
                        }
                    })
                    
                    console.log(myDataParsed);
                //update the sightings count
                    console.log("BEFORE DISPLAYSIGHTINGS, SIGHTINGS = " + sightings);
                    displaySightings(sightings);

                //place markers for all filtered data elements using UFO icon
                    myDataParsed.forEach(function(d){
                        var markerText = "City" + d.city;
                        marker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map)
                        .bindTooltip("<b>City: </b>"  + d.city.substring(0, d.city.indexOf("("))  + "<br><b>Type: </b>" + d.shape);
                        currentLayer = L.marker([d.latitude, d.longitude], {icon: myIcon});
                        markersLayer.addLayer(marker); 
                        markersLayer.addTo(map);
                    })
                })
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
            