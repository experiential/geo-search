<?php
header('Content-Type: text/xml');
header("Cache-Control: no-cache, must-revalidate");
//A date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


// Include standard database functions
require($_SERVER['DOCUMENT_ROOT'] . "/database_functions.php");
//require($_SERVER['DOCUMENT_ROOT'] . "/common/common_functions.php");

// Attempt to connect to database server and select database
$connection = database_connect();

// If we had PHP 5 and therefore SimpleXML...
/*
$request = $_GET["request"];

$xml = simplexml_load_string($request);
$selectedOrder = $xml -> xpath("/request/selected_order");
$selectedFamily = $xml -> xpath("/request/selected_family");
$selectedSpecies = $xml -> xpath("/request/selected_species");
$fieldElements = $xml -> xpath("/request/fields/field");

foreach($fieldElements as $field)
{
*/

if(isset($_GET["type"]))
{
  $polygonType = $_GET["type"];
}
if(isset($_GET["id"]))
{
  $id = (int)$_GET["id"];
}

// Echo out initial part of XML response
echo "<response>";

if($polygonType == "species")
{
  $query = "SELECT Common_name, Scientific_name FROM species WHERE species.Species_ID = " . $id;
  $result = $connection->query($query);
  if($result->num_rows == 1)
  {
    $row = $result->fetch_array();
    echo "<Species_ID>" . $id . "</Species_ID>";
    echo "<Common_name>" . $row["Common_name"] . "</Common_name>";
    echo "<Scientific_name>" . $row["Scientific_name"] . "</Scientific_name>";
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

//echo $query;

// Execute query
$result = $connection->query($query);

$tagOpen = false;
$currentPolygonID = -1;
$currentBoundary = -1;
echo "<br/>num rows: " . $result->num_rows . "<br/>";
while($row = $result->fetch_array())
{
  $thisPolygon = $row["Polygon_ID"];
  $thisBoundary = $row["Boundary"];
  if($currentBoundary != $thisBoundary && $currentPolygonID == $thisPolygon)
  {
    if($tagOpen)
    {
      // There is a tag already open, so close it
      echo "</boundary>";
    }
    
    echo "<boundary>";
    $currentBoundary = $thisBoundary;
    $tagOpen = true;
  }
  else if($currentPolygonID != $thisPolygon)
  {
    if($tagOpen)
    {
      // There is a tag already open, so close it
      echo "</boundary>";
      echo "</polygon>";
    }
    
    echo "<polygon>";
    echo "<boundary>";
    $currentPolygonID = $thisPolygon;
    $currentBoundary = $thisBoundary;
    $tagOpen = true;
  }
  
  echo "<point><phi>" . $row["Phi"] . "</phi><delta>" . $row["Delta"] . "</delta></point>";
}

if($tagOpen)
{
  // There is a tag still open, so close it
  echo "</boundary>";
  echo "</polygon>";
}

// Close response tag
echo "</response>";

$connection->close();


?>