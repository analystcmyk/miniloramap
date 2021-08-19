<?php
include "config.php";

if ($_GET["id"] != APIKEY) {
    die("Auth failed");
}

$json = file_get_contents("php://input");
mb_convert_encoding($json, "UTF-8", "auto");
$results = json_decode($json, true);

if (!$results) {
    die("No valid data");
}

//overwrite latest json for inspection

$outfile = fopen("latest.json", "wa+");
fwrite($outfile, json_encode($results, JSON_PRETTY_PRINT));
fclose($outfile);

// drop packets without a decoded payload
// we expect at least lat/lon sent by the node
$payload = $results["uplink_message"]["decoded_payload"];

if (count($payload) == 0) {
    die("Empty payload");
}

// fetch lat/lon from node
$nodelat = $payload["lat"];
$nodelon = $payload["lon"];

$rx = $results["uplink_message"]["rx_metadata"];

// collect for mapping

if (count($rx) > 0) {
    $line = [];
    foreach ($rx as $key => $value) {
        $line[$key] = [];
        $line[$key]["time"] = $value["time"];
        $line[$key]["rssi"] = $value["rssi"];
        // we dont need high precision
        $gwlat = round($value["location"]["latitude"], 6);
        $gwlon = round($value["location"]["longitude"], 6);
        $line[$key]["gwlat"] = $gwlat;
        $line[$key]["gwlon"] = $gwlon;
        $line[$key]["nodelat"] = $nodelat;
        $line[$key]["nodelon"] = $nodelon;
        $line[$key]["eui"] = $value["gateway_ids"]["eui"];
        $line[$key]["id"] = $value["gateway_ids"]["gateway_id"];
    }
} else {
    die("No rx metadata");
}

// check if data dir exists, create if not
if (!file_exists("data")) {
    mkdir("data", 0755, true);
}
// save data values to txt

$mapfile = "data/map.txt";

// write mapper data
foreach ($line as $lkey => $lvalue) {
    writecsv($mapfile, $lvalue);
}

function writecsv($datafile, $payload)
{
    // write header
    if (!file_exists($datafile)) {
        $outfile = fopen($datafile, "a");
        $fields = "";
        foreach ($payload as $key => $value) {
            $fields .= $key . "|";
        }
        $fields = substr($fields, 0, -1);
        fwrite($outfile, "$fields\n");
        fclose($outfile);
    }

    // write data
    $outfile = fopen($datafile, "a");
    $out = "";
    foreach ($payload as $key => $value) {
        if (is_array($value)) {
            $value = json_encode($value);
        }
        $out .= $value . "|";
    }
    fwrite($outfile, "$out\n");
    fclose($outfile);
}

?>
