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

    // Create a map marker for this SubwayStation object
    self.mapMarker = new google.maps.Marker({
        position: {lat: self.latitude, lng: self.longitude},
        map: map,
        title: self.name
    });

    // Toggles the map marker's bounce animation
    self.toggleMapMarkerBounce = function() {
        var animationState = self.mapMarker.getAnimation();
        if (animationState !== null && animationState !== undefined) {
            self.mapMarker.setAnimation(null);
        } else {
            self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
        hideIOSKeyboard();
    }

    // Centers the map on the requested location. This fires when a listview
    // item is clicked.
    self.focus = function() {
        map.panTo({lat: self.latitude, lng: self.longitude});
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
    }

    // Toggles the map marker's its bounce animation when clicked
    self.mapMarker.addListener('click', self.toggleMapMarkerBounce);
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
        var re = new RegExp(self.filter(), 'i');
        self.stations().forEach(function(station) {
            if (station.name.search(re) !== -1) {
                matches.push(station);
                station.mapMarker.setVisible(true);
            } else {
                station.mapMarker.setVisible(false);
            }
        });
        return matches;
    });

    // Show/hide the list
    self.toggleVisibility = function() {
        self.isVisible(!self.isVisible());
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
