function Flickr() {
    var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=30543d5bbfa8313186b84d5aadecc141&lat={latitude}&lon={longitude}&per_page=6&format=json&nojsoncallback=1';
    // var getInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=30543d5bbfa8313186b84d5aadecc141&photo_id={photo_id}&format=json&nojsoncallback=1';
    var sourceUrl = 'https://farm{farm_id}.staticflickr.com/{server_id}/{photo_id}_{secret}_{size}.jpg'

    function search(latitude, longitude, callback) {
        var url = searchUrl.replace('{latitude}', latitude)
            .replace('{longitude}', longitude);
        $.getJSON(url, callback).fail(function() {
            console.log('ERROR: Flickr photos.search failed');
        });
    }

    // function getInfo(photo_id, callback) {
    //     var url = getInfoUrl.replace('{photo_id}', photo_id);
    //     $.getJSON(url, callback).fail(function() {
    //         console.log('ERROR: Flickr photos.getInfo failed');
    //     });
    // }

    function buildUrl(photoData, size) {
        var url = sourceUrl.replace('{farm_id}', photoData.farm)
            .replace('{server_id}', photoData.server)
            .replace('{photo_id}', photoData.id)
            .replace('{secret}', photoData.secret)
            .replace('{size}', size);
        return url;
    }

    this.getPhotos = function(latitude, longitude) {
        search(latitude, longitude, function(results) {
            var photos = results.photos.photo;
            var urls = [];
            for (var i = 0; i < photos.length; i++) {
                // urls.push(buildUrl(photos[i]));
                console.log(buildUrl(photos[i], 's'));
            }
        });
    }
}

var flickr = new Flickr();
