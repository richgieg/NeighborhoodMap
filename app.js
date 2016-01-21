function SubwayStation(dataObj) {
    var self = this;
    self.name = dataObj.name;
    self.line = dataObj.line;
    self.division = dataObj.division;
    self.routes = dataObj.routes;
    self.latitude = dataObj.latitude;
    self.longitude = dataObj.longitude;
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
        data.stations.forEach(function(dataObj) {
            stations.push(new SubwayStation(dataObj));
        });
        self.stations(stations);
        self.loadingMsg('');
    }).fail(function() {
        self.loadingMsg('Unable to load data... try refreshing');
        console.log('ERROR: Could not acquire subway station data');
    });
}

// Activate Knockout
ko.applyBindings(new ViewModel());
