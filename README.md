# miniloramap
Self hosted minimal mapper for LoRaWAN using TTN ( thethingsnetwork.org )

Create a simple map that shows RSSI between a node and one or more gateways.

## Why? We have TTNmapper!

I highly recommend TTNmapper. ( ttnmapper.org )
It is fast, feature-rich, free to use, well maintained and global. 

For temporary experiments that generate excessive or erroneous data 
you would prefer not to mess up the TTNmapper map 
and systems, e.g. when you have multiple antenna 
setups that you would like to compare and archive for later analysis. 
	
For this situations you might prefer a simple RSSI representation.

Mini LoRaMapper is very simple, e.g. it does not look at HDOP, and even lowers the GPS precision.

Mini LoRaMapper runs perfectly fine next to TTNmapper, just add a new webhook integration in TTN console.

For public coverage maps please contribute to TTNmapper by 
- creating an integration with TTNmapper
- contributing to the project https://docs.ttnmapper.org/FAQ.html

## Warning
	
- This code has not been reviewed for security issues.
- This code is PoC level, do not use this for production
- There is no authentication mechanism, so you would definitely want to run this on a webserver with TLS

## Prerequisites:

- a LoRaWAN node with GPS, that sends LAT and LON in the payload.
- a Webserver with PHP


## Install : 

- upload files to a separate folder on your webserver
- create an empty file "map.txt", writable by webserver
- change the apikey value in config.php
- create a webhook integration in TTN console that points to 
  https://mywebserver/save.php?id=xyz where xyz is the apikey you defined.
- try sending a few messages, and check if map.txt is being populated

## Use : 

- open index.html in your browser

## Credits and inspired by : 

- https://github.com/ttnmapper
- https://github.com/HandsOnDataViz/leaflet-map-csv
- https://leafletjs.com
- https://github.com/maydemirx/leaflet-tag-filter-button
- https://jquery.com/
- https://www.papaparse.com/

## Improvements / todo

- check using headers/post in order to not leak the key via serverlogs
- adjust RSSI scale to reality



