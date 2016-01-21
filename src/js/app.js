function SubwayStation(dataObj) {
    var self = this;
    self.name = dataObj.name;
    self.line = dataObj.line;
    self.division = dataObj.division;
    self.routes = dataObj.routes;
    self.latitude = parseFloat(dataObj.latitude);
    self.longitude = parseFloat(dataObj.longitude);
    self.mapMarker =  new google.maps.Marker({
        position: {lat: self.latitude, lng: self.longitude},
        map: map,
        title: self.name
    });
    self.display = ko.computed(function() {
        return self.name + ' (' + self.line + ' / ' + self.division + ')' +
            ' [' + self.routes.join()  + ']';
    });
}

function ViewModel() {
    var self = this;

    // Observables
    self.stations = ko.observableArray([]);
    self.filter = ko.observable('');
    self.loadingMsg = ko.observable('Loading subway stations...');

    // Computed Observables
    self.matchingStations = ko.computed(function() {
        var matches = [];
        var re = new RegExp(self.filter(), 'i');
        self.stations().forEach(function(val) {
            if (val.name.search(re) !== -1) {
                matches.push(val);
            }
        });
        return matches;
    });

    // Methods
    self.activateStation = function(station) {
        alert(station.display());
    };

    // Initialize the stations array asynchronously
    var jsonUrl = 'https://www.richgieg.com/nyc-subway-api/stations';
    $.getJSON(jsonUrl, function(data) {
        var stations = [];
        var station;
        data.stations.forEach(function(dataObj) {
            // Create SubwayStation object and append it to the stations array
            station = new SubwayStation(dataObj);
            stations.push(station);
        });
        self.stations(stations);
        self.loadingMsg('');
    }).fail(function() {
        self.loadingMsg('Unable to load data... try refreshing');
        console.log('ERROR: Could not acquire subway station data');
    });
}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.718092, lng: -73.901454},
        zoom: 12
    });

    // Activate Knockout once the map is initialized
    ko.applyBindings(new ViewModel());
}
