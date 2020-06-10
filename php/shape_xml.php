<?php
header('Content-Type: text/json');
header("Cache-Control: no-cache, must-revalidate");
//A date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


// Include standard database functions
require($_SERVER['DOCUMENT_ROOT'] . "/database_functions.php");
//require($_SERVER['DOCUMENT_ROOT'] . "/common/common_functions.php");

// Attempt to connect to database server and select database
$connection = database_connect();


$debugOutput = "";
$startTime = microtime(true);


if(isset($_GET["type"]))
{
  $polygonType = $_GET["type"];
}
else
{
  $polygonType = "species";
}
if(isset($_GET["id"]))
{
  $id = (int)$_GET["id"];
}
//echo "Id: $id";

// Create top level response array
$response = [];

if($polygonType == "species")
{
  $query = "SELECT Common_name, Scientific_name FROM species WHERE species.Species_ID = " . $id;
  $result = $connection->query($query);
  if($result->num_rows == 1)
  {
    $row = $result->fetch_array();
    $debugOutput .= "Species_ID: " . $id;
    $response["speciesID"] = $id;
  }
}


// Construct query for polygon data
if($polygonType == "species")
{
  $query = "SELECT polygon_points.Polygon_ID, Boundary, Phi, Delta FROM polygon_points, polygon WHERE polygon_points.Polygon_ID = polygon.Polygon_ID AND Species_ID = " . $id;
}
else if($polygonType == "country")
{
  $query = "SELECT polygon_points.polygon, boundary, x, y FROM polygon_points, country_polygon WHERE polygon_points.polygon=country_polygon.polygon AND country_ID=" . $id;
}
$query .= " ORDER BY polygon_points.Polygon_ID, Boundary, Point_number";

$debugOutput .= $query;
//echo "Query: $query";


// Execute query
$result = $connection->query($query);

$rangeArray = [];

$currentPolygonID = -1;
$currentBoundary = -1;
$currentPolygonArray = null;
$currentBoundaryArray = null;


//echo "<br/>num rows: " . $result->num_rows . "<br/>";
while($row = $result->fetch_array())
{
  $thisPolygon = $row["Polygon_ID"];
  $thisBoundary = $row["Boundary"];
  if($currentBoundary != $thisBoundary && $currentPolygonID == $thisPolygon)
  {
    if($currentBoundaryArray)
    {
      $currentPolygonArray[] = $currentBoundaryArray;
    }

    $debugOutput .= "Adding new boundary...";
    $currentBoundaryArray = [];
    $currentBoundary = $thisBoundary;
  }
  else if($currentPolygonID != $thisPolygon)
  {
    if($currentPolygonArray !== null)
    {
      $currentPolygonArray[] = $currentBoundaryArray;
      $rangeArray[] = $currentPolygonArray;
      //echo "rangeArray:"; print_r($rangeArray);
    }

    $debugOutput .= "Adding new polygon...";
    //echo "currentBoundaryArray:"; print_r($currentBoundaryArray);
    //echo "rangeArray:"; print_r($rangeArray);
    $currentPolygonArray = [];
    $currentBoundaryArray = [];
    //echo "rangeArray:"; print_r($rangeArray);
    $currentPolygonID = $thisPolygon;
    $currentBoundary = $thisBoundary;
    //echo "rangeArray:"; print_r($rangeArray);
  }

  //echo "<point><phi>" . $row["Phi"] . "</phi><delta>" . $row["Delta"] . "</delta></point>";
  $currentBoundaryArray[] = (float) $row["Phi"];
  $currentBoundaryArray[] = (float) $row["Delta"];
  //echo "currentBoundaryArray:"; print_r($currentBoundaryArray);

}

// Add last polygon  
if($currentPolygonArray)
{
  $currentPolygonArray[] = $currentBoundaryArray;
  $rangeArray[] = $currentPolygonArray;
}

$response["range"] = $rangeArray;
$response["debugOutput"] = $debugOutput;

// Output JSON response
echo json_encode($response);

$connection->close();


?>