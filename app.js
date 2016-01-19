function SubwayStation(name, line, division, routes, latitude, longitude) {
    var self = this;
    self.name = name;
    self.line = line;
    self.division = division;
    self.routes = routes;
    self.latitude = latitude;
    self.longitude = longitude;
    self.display = ko.computed(function() {
        return self.name + ' (' + self.line + ' / ' + self.division + ')' +
            ' [' + self.routes.join()  + ']';
    });
}


function ViewModel(locations) {
    var self = this;
    self.locations = locations;
    self.filter = ko.observable('');
    self.matchingLocations = ko.computed(function() {
        var matches = [];
        var re = new RegExp(self.filter(), 'i');
        self.locations.forEach(function(val) {
            if (val.name.search(re) !== -1) {
                matches.push(val);
            }
        });
        return matches;
    });

    self.talk = function(location) {
        alert(location);
    };
}


function createSubwayStationArray(records) {
    // Sort by latitude, then by longitude
    records.sort(function(a, b) {
        // Latitude first
        if (a.Station_Latitude < b.Station_Latitude) {
            return -1;
        } else if (a.Station_Latitude > b.Station_Latitude) {
            return 1;
        // Longitude second
        } else if (a.Station_Longitude < b.Station_Longitude) {
            return -1;
        } else if (a.Station_Longitude > b.Station_Longitude) {
            return 1;
        // Equal
        } else {
            return 0;
        }
    });

    // Filter duplicate records (based on latitude and longitude)
    var curLat, curLong;
    var prevLat = 0;
    var prevLong = 0;
    var dupesRemoved = [];
    for (var i = 0; i < records.length; i++) {
        curLat = records[i].Station_Latitude;
        curLong = records[i].Station_Longitude;
        if ((curLat !== prevLat) || (curLong !== prevLong)) {
            dupesRemoved.push(records[i]);
            prevLat = curLat;
            prevLong = curLong;
        }
    }

    // Build list of route property names for next step
    var routeProperties = [];
    for (var i = 1; i < 12; i++) {
        routeProperties.push('Route_' + i);
    }

    // Convert records to array of SubwayStation objects
    var locations = [];
    var routes;
    var curRecord;
    for (var i = 0; i < dupesRemoved.length; i++) {
        curRecord = dupesRemoved[i];

        // Parse routes
        routes = [];
        for (var j = 0; j < 11; j++) {
            if (curRecord[routeProperties[j]]) {
                routes.push(curRecord[routeProperties[j]]);
            }
        }
        routes.sort();

        // Create SubwayStation object and push to locations array
        locations.push(
            new SubwayStation(
                curRecord.Station_Name,
                curRecord.Line,
                curRecord.Division,
                routes,
                curRecord.Station_Latitude,
                curRecord.Station_Longitude
        ));
    }

    // Sort by station name, then by line
    locations.sort(function(a, b) {
        // Name first
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        // Line second
        } else if (a.line < b.line) {
            return -1;
        } else if (a.line > b.line) {
            return 1;
        // Equal
        } else {
            return 0;
        }
    });

    // Filter duplicate stations (based on name and line)
    var locsToFilter = locations;
    locations = [];
    var curName, curLine;
    var prevName = '';
    var prevLine = '';
    for (var i = 0; i < locsToFilter.length; i++) {
        curName = locsToFilter[i].name;
        curLine = locsToFilter[i].line;
        if ((curName != prevName) || (curLine != prevLine)) {
            locations.push(locsToFilter[i]);
            prevName = curName;
            prevLine = curLine;
        }
    }

    return locations;
}


// Parse subway station CSV file asynchronously. When complete, the callback
// will be invoked. First, the callback processes the CSV records to build an
// array of SubwayStation objects. Second, it activates Knockout, passing the
// array to the main view model.
Papa.parse('nyc-subway-stations.csv', {
    header: true,
    download: true,
    complete: function(results) {
        // Process the CSV records to create array of SubwayStation objects
        var locations = createSubwayStationArray(results.data);

        // Activate Knockout
        ko.applyBindings(new ViewModel(locations));
    }
});
