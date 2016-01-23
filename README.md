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

## Running the Application

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

If you would like to quickly run the application for the sole purpose of viewing the pages (not
rating with Google PageSpeed Insights), follow these steps:

- Download the project's ZIP file
- Extract the ZIP file
- Navigate to the `dist` directory
- Run `index.html` using your favorite browser

### Option #2

If you would like to serve the site publicly on the Internet for the purpose of rating the site
using Google's PageSpeed Insights, follow these steps:

- Download the project's ZIP file
- Extract the ZIP file
- Install [Python](https://www.python.org/downloads/) (method varies by OS... if you're on Linux you probably have it already)
- Download and extract [ngrok](https://ngrok.com/download)
- In a terminal, navigate to the WebsiteOptimization project's `dist` directory
- Run `python -m SimpleHTTPServer 8080`
- In a different terminal, navigate to the location of the extracted `ngrok` binary
- Run `./ngrok http 8080` on Linux, or `ngrok http 8080` on Windows
- Copy the URL you are given and test it in a browser
- Visit [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) and submit the URL
```
```
