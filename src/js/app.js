// Helper function for taking focus away from textbox on iOS devices
function hideIOSKeyboard() {
     document.activeElement.blur();
     $("input").blur();
}


// Model representing a subway station
function SubwayStation(dataObj) {
    var self = this;
    self.name = dataObj.name;
    self.line = dataObj.line;
    self.division = dataObj.division;
    self.routes = dataObj.routes;
    self.latitude = parseFloat(dataObj.latitude);
    self.longitude = parseFloat(dataObj.longitude);

    // Create the map marker for this SubwayStation object
    self.mapMarker = new google.maps.Marker({
        position: {lat: self.latitude, lng: self.longitude},
        map: map,
        title: self.name
    });

    // Create the info window for this SubwayStation object
    self.infoWindow = new google.maps.InfoWindow();

    // Shows the info window, building content first if necessary
    self.showInfoWindow = function() {
        // If necessary, build the info window content (only happens once)
        if (!self.infoWindow.getContent()) {
            self.infoWindow.setContent('Loading content...');
            var content = '<h3 class="info-title">' + self.name + '</h3>';
            content += '<small class="info-subtitle">' + self.line + ' / ' +
                self.division + '</small>';
            content += '<p class="info-route-list">Routes: '
            content += '<span class="info-routes">' + self.routes.join() +
                '</span></p>';
            self.infoWindow.setContent(content);

            // // Simulate API call
            // setTimeout(function() {
            //     content += '<h1>test</h1>';
            //     self.infoWindow.setContent(content);
            // }, 1000);

            // var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=30543d5bbfa8313186b84d5aadecc141&photo_id=24446640991&format=json&nojsoncallback=1';
            // $.getJSON(flickrUrl, function(data) {
            //     console.log(data);
            // }).fail(function() {
            //     console.log('ERROR: Could not acquire Flickr data');
            // });

            flickr.getPhotos(self.latitude, self.longitude, function(results) {
                console.log(results);
                content += '<div class="flickr-box">'
                content += '<h3 class="flickr-headline">Flickr Photos</h3>';
                results.forEach(function(info) {
                    content += '<img class="flickr-thumb" src="' +
                        info.imgThumbUrl + '">';
                });


                '</div>';
                self.infoWindow.setContent(content);
            });
        }

        // Show info window
        self.infoWindow.open(map, self.mapMarker);
    }

    // Centers the map on the requested location, animates the map marker,
    // and opens the marker's info window. This fires when a listview item
    // is clicked, via Knockout.
    self.focus = function() {
        map.panTo({lat: self.latitude, lng: self.longitude});
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        self.showInfoWindow();
    }

    // Toggles the map marker's bounce animation and opens the marker's info
    // window. This is the callback for the marker's click event.
    self.mapMarkerClickHandler = function() {
        // Get current animation state
        var animationState = self.mapMarker.getAnimation();

        // If currently animating, stop animating and close info window
        if (animationState !== null && animationState !== undefined) {
            self.mapMarker.setAnimation(null);
            self.infoWindow.close();
        // Otherwise, start animating and open info window
        } else {
            self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
            self.showInfoWindow();
        }

        // Remove focus from filter textbox when marker is clicked (on iOS)
        hideIOSKeyboard();
    }

    // Sets mapMarkerClickHandler as the click callback for the map marker
    self.mapMarker.addListener('click', self.mapMarkerClickHandler);
}


// Main list view
function ListViewModel() {
    var self = this;
    self.stations = ko.observableArray([]);
    self.filter = ko.observable('');
    self.loadingMsg = ko.observable('Loading subway stations...');
    self.isVisible = ko.observable(true);

    // Update the list contents whenever the filter is modified. Also toggles
    // map marker visibility depending on the filter results.
    self.filterResults = ko.computed(function() {
        var matches = [];
        // Create a regular expression for performing a case-insensitive
        // search using the current value of the filter observable
        var re = new RegExp(self.filter(), 'i');

        // Iterate over all stations objects, searching for a matching name
        self.stations().forEach(function(station) {
            // If it's a match, save it to the list of matches and show its
            // corresponding map marker
            if (station.name.search(re) !== -1) {
                matches.push(station);
                station.mapMarker.setVisible(true);
            // Otherwise, ensure the corresponding map marker is hidden
            } else {
                station.mapMarker.setVisible(false);
            }
        });

        return matches;
    });

    // Show/hide the list when the toggle button is clicked
    self.toggleVisibility = function() {
        self.isVisible(!self.isVisible());
    }

    // This fires when a list item is clicked
    self.clickHandler = function(station) {
        // Hide the list if the viewing area is small
        if (window.innerWidth < 1024) {
            self.isVisible(false);
        }

        // Show the station's map marker and info window
        station.focus();
    }

    // Initialize the array of SubwayStation objects asynchronously
    var jsonUrl = 'https://www.richgieg.com/nyc-subway-api/stations';
    $.getJSON(jsonUrl, function(data) {
        var stations = [];
        data.stations.forEach(function(dataObj) {
            // Create SubwayStation object and append it to the stations array
            stations.push(new SubwayStation(dataObj));
        });
        self.stations(stations);
        // Set the loading message to null, effectively hiding it
        self.loadingMsg(null);
    }).fail(function() {
        self.loadingMsg('Unable to load data... try refreshing');
        console.log('ERROR: Could not acquire subway station data');
    });
}


// Callback that initializes the Google Map object and activates Knockout
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 40.718092, lng: -73.901454},
        disableDefaultUI: true
    });

    // Ensure focus is taken away from textbox when map is touched (on iOS)
    map.addListener('click', function() {
         hideIOSKeyboard();
    })

    // Activate Knockout once the map is initialized
    ko.applyBindings(new ListViewModel());
}


// Google Map object
var map;
