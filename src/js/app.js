// Helper function for taking focus away from textbox on iOS devices
function hideIOSKeyboard() {
     document.activeElement.blur();
     $("input").blur();
}


// Object representing a subway station
function SubwayStation(dataObj) {
    var self = this;
    self.name = dataObj.name;
    self.line = dataObj.line;
    self.division = dataObj.division;
    self.routes = dataObj.routes;
    self.latitude = parseFloat(dataObj.latitude);
    self.longitude = parseFloat(dataObj.longitude);
    self.flickrContent = null;

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
        // Build the basic info window content, if hasn't been done
        if (!self.infoWindow.getContent()) {
            // Initialize basic info window content and display it
            self.infoWindow.setContent('Loading content...');
            var content = '<h3 class="info-title">' + self.name + '</h3>';
            content += '<small class="info-subtitle">' + self.line + ' / ' +
                self.division + '</small>';
            content += '<p class="info-route-list">Routes: '
            content += '<span class="info-routes">' + self.routes.join() +
                '</span></p>';
            self.infoWindow.setContent(content);
        }

        // Build the Flickr content for the info window, if hasn't been done
        if (!self.flickrContent) {
            // Use Flickr API to retrieve photos related to the location,
            // then display the data using a callback function
            flickr.getPhotos(self.latitude, self.longitude, function(results) {
                var content = '<div class="flickr-box">';
                content += '<h3 class="flickr-headline">Flickr Photos</h3>';
                results.forEach(function(info) {
                    content += '<a class="flickr-thumb" href="' +
                        info.photoPage + '" target="_blank">' + '<img src="' +
                        info.imgThumbUrl + '"></a>';
                });
                content +='</div>';
                self.flickrContent = content;
                var allContent = self.infoWindow.getContent() + content;
                self.infoWindow.setContent(allContent);
            });
        }

        // Show info window
        self.infoWindow.open(map, self.mapMarker);
    }

    // Enables marker bounce animation and shows the info window. If another
    // SubwayStation object is active, it is deactivated first, since only one
    // object can be active at a time. This prevents UI clutter.
    self.activate = function() {
        // Check the variable that references the currently active
        // SubwayStation object. If the value is not null and it doesn't point
        // to this object, then run its deactivate method.
        if (SubwayStation.prototype.active) {
            if (SubwayStation.prototype.active !== self) {
                SubwayStation.prototype.active.deactivate();
            }
        }

        // Enable marker bounce animation and show info window
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        self.showInfoWindow();

        // Set this SubwayStation object as the active one
        SubwayStation.prototype.active = self;
    }

    // Disables marker bounce animation and closes the info window
    self.deactivate = function() {
        // Disable marker bounce and close info window
        self.mapMarker.setAnimation(null);
        self.infoWindow.close();

        // Since this object is being deactivated, the class variable which
        // holds the reference to the active object is set to null
        SubwayStation.prototype.active = null;
    }

    // Centers the map on the requested location, then activates this
    // SubwayStation object. This fires when a listview item is clicked,
    // via Knockout.
    self.focus = function() {
        map.panTo({lat: self.latitude, lng: self.longitude});
        self.activate();
    }

    // Toggles the active state of this SubwayStation object. This is the
    // callback for the marker's click event.
    self.mapMarkerClickHandler = function() {
        // If currently active (marker bouncing, info window visible),
        // deactivate. Otherwise, activate.
        if (SubwayStation.prototype.active === self) {
            self.deactivate();
        } else {
            self.activate();
        }

        // Remove focus from filter textbox when marker is clicked (on iOS)
        hideIOSKeyboard();
    }

    // Deactivates this SubwayStation object when the info marker's close
    // button is clicked
    self.infoWindowCloseClickHandler = function() {
        self.deactivate();
    }

    // Sets mapMarkerClickHandler as the click callback for the map marker
    self.mapMarker.addListener('click', self.mapMarkerClickHandler);

    // Sets infoWindowCloseClickHandler as the click callback for the info
    // window's close button
    self.infoWindow.addListener('closeclick', self.infoWindowCloseClickHandler);
}

// Static class variable that stores the active SubwayStation object. The
// active SubwayStation is the one with a visible info window.
SubwayStation.prototype.active = null;


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


// This fires if there's an issue loading the Google Maps API script
function initMapLoadError() {
    alert('Failed to initialize the Google Maps API');
    console.log('Failed to initialize Google Maps API');
}


// Google Map object
var map;
