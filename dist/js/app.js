function hideIOSKeyboard(){document.activeElement.blur(),$("input").blur()}function SubwayStation(a){var b=this;b.name=a.name,b.line=a.line,b.division=a.division,b.routes=a.routes,b.latitude=parseFloat(a.latitude),b.longitude=parseFloat(a.longitude),b.flickrContent=null,b.mapMarker=new google.maps.Marker({position:{lat:b.latitude,lng:b.longitude},map:map,title:b.name}),b.infoWindow=new google.maps.InfoWindow,b.showInfoWindow=function(){if(!b.infoWindow.getContent()){b.infoWindow.setContent("Loading content...");var a='<h3 class="info-title">'+b.name+"</h3>";a+='<small class="info-subtitle">'+b.line+" / "+b.division+"</small>",a+='<p class="info-route-list">Routes: ',a+='<span class="info-routes">'+b.routes.join()+"</span></p>",b.infoWindow.setContent(a)}b.flickrContent||flickr.getPhotos(b.latitude,b.longitude,function(a){var c='<div class="flickr-box">';c+='<h3 class="flickr-headline">Flickr Photos</h3>',a.forEach(function(a){c+='<a class="flickr-thumb" href="'+a.photoPage+'" target="_blank"><img src="'+a.imgThumbUrl+'"></a>'}),c+="</div>",b.flickrContent=c;var d=b.infoWindow.getContent()+c;b.infoWindow.setContent(d)}),b.infoWindow.open(map,b.mapMarker)},b.focus=function(){map.panTo({lat:b.latitude,lng:b.longitude}),b.mapMarker.setAnimation(google.maps.Animation.BOUNCE),b.showInfoWindow()},b.mapMarkerClickHandler=function(){var a=b.mapMarker.getAnimation();null!==a&&void 0!==a?(b.mapMarker.setAnimation(null),b.infoWindow.close()):(b.mapMarker.setAnimation(google.maps.Animation.BOUNCE),b.showInfoWindow()),hideIOSKeyboard()},b.mapMarker.addListener("click",b.mapMarkerClickHandler)}function ListViewModel(){var a=this;a.stations=ko.observableArray([]),a.filter=ko.observable(""),a.loadingMsg=ko.observable("Loading subway stations..."),a.isVisible=ko.observable(!0),a.filterResults=ko.computed(function(){var b=[],c=new RegExp(a.filter(),"i");return a.stations().forEach(function(a){-1!==a.name.search(c)?(b.push(a),a.mapMarker.setVisible(!0)):a.mapMarker.setVisible(!1)}),b}),a.toggleVisibility=function(){a.isVisible(!a.isVisible())},a.clickHandler=function(b){window.innerWidth<1024&&a.isVisible(!1),b.focus()};var b="https://www.richgieg.com/nyc-subway-api/stations";$.getJSON(b,function(b){var c=[];b.stations.forEach(function(a){c.push(new SubwayStation(a))}),a.stations(c),a.loadingMsg(null)}).fail(function(){a.loadingMsg("Unable to load data... try refreshing"),console.log("ERROR: Could not acquire subway station data")})}function initMap(){map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.718092,lng:-73.901454},disableDefaultUI:!0}),map.addListener("click",function(){hideIOSKeyboard()}),ko.applyBindings(new ListViewModel)}var map;