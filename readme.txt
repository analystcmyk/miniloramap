Mini LoRaMapper

What is it?

	Create a simple map that shows RSSI between a node and a gateway.


Why? We have TTNmapper!

	I highly recommend TTNmapper. ( ttnmapper.org )
	It is fast, feature-rich, free to use, well maintained and global. 

	For temporary experiments that generate excessive or erroneous data 
	you would like not to mess up TTNmapper map 
	and systems.eg when you have multiple antenna 
	setups that you would like to compare and archive for later analysis. 
	
	For this situations you might prefer a simple RSSI representation.

	Mini LoRaMapper is very simple, e.g. it does not look at 
	HDOP, and even lowers the GPS precision.

	Mini LoRaMapper runs perfectly fine next to TTNmapper.

	For real coverage maps please contribute to TTNmapper by 
	- creating an integration with TTNmapper
	- contributing to the project https://docs.ttnmapper.org/FAQ.html

Warning
	
- This software has not been reviewed for security issues.

Prerequisites:

- a GPS node that sends LAT and LON in the payload
- a webserver with php


Install : 

- upload files to a separate folder on your webserver
- create an empty file "map.txt", writable by webserver
- change the apikey value in config.php
- create a webhook integration that points to 
  https://mywebserver/save.php?id=xyz where xyz is the apikey you defined.
- try sending a few messages, and check if map.txt is being populated

Use : 

- open https://mywebserver/index.html

Credits and inspired by : 

- https://github.com/ttnmapper
- https://github.com/HandsOnDataViz/leaflet-map-csv
- https://leafletjs.com
- https://github.com/maydemirx/leaflet-tag-filter-button
- https://jquery.com/
- https://www.papaparse.com/

License : 

MIT License

Copyright (c) 2018 Mini LoRaMapper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
