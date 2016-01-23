# Neighborhood Map Project

This is the fifth project in my pursuit of the Front-End Web Developer
Nanodegree from Udacity. Following is Udacity's description for this project:

"You will develop a single-page application featuring a map of your neighborhood
or a neighborhood you would like to visit. You will then add additional
functionality to this application, including: map markers to identify popular
locations or places you’d like to visit, a search function to easily discover
these locations, and a listview to support simple browsing of all locations. You
will then research and implement third-party APIs that provide additional
information about each of these locations (such as StreetView images, Wikipedia
articles, Yelp reviews, etc)."
```
```

## Synopsis

I decided to use New York City subway stations as the marked locations in my
map project. I retrieved the data I needed from the developer section of the
website for the Metropolitan Transit Authority (MTA). The source CSV file I
used can be found [here](http://web.mta.info/developers/data/nyct/subway/StationEntrances.csv).
Since the CSV file's contents consists of not only subway stations, but subway
station entrances and exits, I had to distill the data down in such a way that
I ended up with only unique subway stations. I then created a JSON formatted
file with the condensed data and built a very basic read-only API to be utilized by my map
application. The API is hosted on my web server [here](https://www.richgieg.com/nyc-subway-api/stations).
Additionaly, I use the Flickr API to acquire images that are within 1 km of the
geolocation of the subway stations. The Flickr API is only called upon when a
station's marker is clicked on the map. Once a particular station's Flickr
data has been acquired, it is cached and the Flickr API is not accessed for
that particular subway station again.
```
```

## Accessing the Hosted Application

For your convenience, I've hosted this application on my own web server. You
may access it through the following link:

[https://www.richgieg.com/neighborhood-map/](https://www.richgieg.com/neighborhood-map/)
```
```

## Running the Application Locally

There are two options for running the application. The first option entails
downloading the project's zip file, extracting it, then running `dist/index.html`
in your favorite browser. This method is fine for just viewing the site on your
computer, but you won't be able to test it with a mobile device over a 3G/4G
connection. The second option consists of running a local web server, then
using a tunneling tool called `ngrok` to make your local web server publicly
available (temporarily). You will be presented with a URL, by `ngrok`, which will
allow your web server to be accessible on the Internet. Therefore, you will be
able to use that URL to access the site with a mobile device over a 3G/4G connection.

### Option #1

If you would like to quickly run the application for the sole purpose of viewing the
site locally (not testing on a mobile device over a 3G/4G connection), follow these
steps:

- Download the project's ZIP file
- Extract the ZIP file
- Navigate to the `dist` directory
- Run `index.html` using your favorite browser

### Option #2

If you would like to serve the site publicly on the Internet for the purpose of testing
on a mobile device over a 3G/4G connection, follow these steps:

- Download the project's ZIP file
- Extract the ZIP file
- Install [Python](https://www.python.org/downloads/) (method varies by OS... if you're on Linux you probably have it already)
- Download and extract [ngrok](https://ngrok.com/download)
- In a terminal, navigate to the NeighborhoodMapProject `dist` directory
- Run `python -m SimpleHTTPServer 8080`
- In a different terminal, navigate to the location of the extracted `ngrok` binary
- Run `./ngrok http 8080` on Linux, or `ngrok http 8080` on Windows
- Copy the URL you are given and test it in a browser
- Visit the same URL on your mobile device over a 3G/4G connection
```
```

## Building the Application

If you would like to tinker with the code, make sure to edit the code that's
in the `src` directory (development directory). Once you're done editing code,
you will have to run the build process to generate the `dist` directory
(production directory). The production directory contains the files that
should actually be served on the live site. Follow these steps in order to
run the build process.

### Prerequisites

You must have this software installed prior to attempting to run the build process.

- Install [Node.js](https://nodejs.org/en/download/)
- Install [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) (the `Node.js` package manager)
- Install [Grunt CLI](http://gruntjs.com/getting-started)
- Install [ImageMagick](http://www.imagemagick.org/script/binary-releases.php)
- In a terminal, navigate to the NeighborhoodMapProject root directory
- Run `npm install` in order to download all the required Grunt modules into the `node_modules` directory

### Execute Grunt

After the prequisites are installed, you may run the Grunt build process.

- In a terminal, navigate to the NeighborhoodMapProject root directory
- Run `grunt`

*If all goes well, you should see: `Done, without errors.` At this point, the `dist`
directory should be populated with any modifications you made, minified and optimized
for production.*
