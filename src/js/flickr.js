// Constructor for the Flickr API helper object
function Flickr() {
    var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=30543d5bbfa8313186b84d5aadecc141&lat={latitude}&lon={longitude}&radius=1&per_page=8&format=json&nojsoncallback=1';
    var getInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=30543d5bbfa8313186b84d5aadecc141&photo_id={photo_id}&format=json&nojsoncallback=1';
    var sourceUrl = 'https://farm{farm_id}.staticflickr.com/{server_id}/{photo_id}_{secret}_{size}.jpg'

    // Internal function that uses the Flickr API flickr.photos.search to
    // find photos that match the latitude and longitude arguments
    function search(latitude, longitude, callback) {
        var url = searchUrl.replace('{latitude}', latitude)
            .replace('{longitude}', longitude);
        $.getJSON(url, callback).fail(function() {
            alert('ERROR: Failed to search Flickr for related photos');
            console.log('ERROR: Flickr photos.search failed');
        });
    }

    // Internal function that uses the Flickr API flickr.photos.getInfo to
    // obtain extended info on a photo
    function getInfo(photo_id, callback) {
        var url = getInfoUrl.replace('{photo_id}', photo_id);
        $.getJSON(url, callback).fail(function() {
            alert('ERROR: Failed to obtain info for Flickr photo (id: ' +
                photo_id + ')');
            console.log('ERROR: Flickr photos.getInfo failed');
        });
    }

    // Initialize the info object for a photo. This function initializes the
    // object by adding URLs that point to the thumbnail and medium-size
    // source images for the photo referenced in the photoData argument.
    function initInfoObject(photoData, size) {
        var url = sourceUrl.replace('{farm_id}', photoData.farm)
            .replace('{server_id}', photoData.server)
            .replace('{photo_id}', photoData.id)
            .replace('{secret}', photoData.secret);
        var obj = {
            imgThumbUrl: url.replace('{size}', 's'),
            imgMediumUrl: url.replace('{size}', 'z')
        };
        return obj;
    }

    // This function is exposed to the app. It uses the Flickr API to search
    // for photos that match the latitude and longitude arguments. Once it
    // finds matching photos, it uses the Flickr API to obtain more info about
    // the photos, such as their "photo page URL." As soon as all the data
    // has been retrieved, the callback function is invoked.
    this.getPhotos = function(latitude, longitude, callback) {
        search(latitude, longitude, function(results) {
            var photos = results.photos.photo;
            var infoObjects = [];
            var infoObj;

            // Iterate over each photo result, building URLs for the source
            // images as well as collecting extra info about the photo
            for (var i = 0; i < photos.length; i++) {
                // Create info object, initially containing photo's source URLs
                infoObj = initInfoObject(photos[i]);
                infoObjects.push(infoObj);

                // Get extra info about the photo and add it to the info
                // object. Since this creates a callback that needs access to
                // a local variable that changes with each loop iteration, the
                // code uses an immediately-invoked function expression.
                var getInfoCounter = 0;
                getInfo(photos[i].id, (function(infoObj) {
                    return function(info) {
                        infoObj.photoPage = info.photo.urls.url[0]._content;
                        infoObj.title = info.photo.title._content;

                        // Keep track of how many successful getInfo calls
                        // we've made
                        getInfoCounter++;

                        // Once the number of getInfo calls reaches the number
                        // of original photo results, invoke the callback arg
                        // since the info objects are now completely built
                        if (getInfoCounter === photos.length) {
                            callback(infoObjects);
                        }
                    }
                })(infoObj));
            }
        });
    }
}


// Global flickr object to be utilized by the app
var flickr = new Flickr();
