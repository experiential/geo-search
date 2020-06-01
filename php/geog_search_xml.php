<?php
header('Content-Type: text/html');
header("Cache-Control: no-cache, must-revalidate");
//A date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// Constants
$radiusOfEarthKm = 6371.009;
$halfOfEarthCircum = $radiusOfEarthKm * pi();
$qtrOfEarthCircum = $halfOfEarthCircum / 2;

$debugOutput = "";
$startTime = microtime(true);
$altflag = true;

// Include standard database functions
require($_SERVER['DOCUMENT_ROOT'] . "/database_functions.php");

// Attempt to connect to database server and select database
$connection = database_connect();

$testPhi = 0.0;
$testDelta = 0.0;
if(isset($_GET["phi"]))
{
  $testPhi = $_GET["phi"];
}
if(isset($_GET["delta"]))
{
  $testDelta = $_GET["delta"];
}
if(isset($_GET["range"]))
{
  $proximity = $_GET["range"];
}
if(array_key_exists("sortBy", $_GET))
{
  $sortBy = $_GET["sortBy"];
  $sortOrder = $_GET["sortOrder"];
}
$testPoint = array($testPhi, $testDelta);
$testPointCartesian = geogToCartesian($testPoint);
$debugOutput .= "TestPhi=".$testPhi." TestDelta=".$testDelta."<br/>";

// Create results object for JSON response
$response = [ "results" => [] ];

// Construct query
$query = "SELECT species.Species_ID, Species_order, Species_family, Scientific_name, Common_name, GE_score, Polygon_ID ";
$query .= "FROM polygon, species ";
$query .= "WHERE polygon.Species_ID = species.Species_ID ";
if($sortBy != "")
{
  $query .= "ORDER BY `" . $sortBy . "`";
  if($sortOrder == "DESC")
  {
    $query .= " DESC";
  }
  else
  {
    $query .= " ASC";
  }
  $query .= ", Polygon_ID";
}
else
{
  $query .= "ORDER BY GE_score+0, Scientific_name, Polygon_ID";
}
$debugOutput .= "<div>Query: " . $query . "</div>";

// Execute query
$queryStartTime = microtime(true);
$result = $connection->query($query);
$debugOutput .= "<br/><br/>Inital query took " . (microtime(true) - $queryStartTime) . " seconds<br/>";

$speciesList = array();
$speciesData = array();
$speciesPolygons = array( array() );
$thisPolygon = 0;
$currentSpeciesID = -1;
while($row = $result->fetch_array())
{
  $thisSpeciesID = $row["Species_ID"];
  if($thisSpeciesID != $currentSpeciesID)
  {
    //echo "Adding species " . $thisSpeciesID . "<br/>";
    $speciesData[$thisSpeciesID] = array("Scientific_name" => $row["Scientific_name"],
                                         "Common_name" => $row["Common_name"],
                                         "Species_order" => $row["Species_order"],
                                         "Species_family" => $row["Species_family"],
                                         "GE_score" => $row["GE_score"],
                                         "Edgeometer" => $row["Edgeometer"],
                                         "EDGE_rank" => $row["EDGE_rank"]);
    $thisPolygon = 0;
    $currentSpeciesID = $thisSpeciesID;
  }
  else
  {
    $thisPolygon++;
  }
  $speciesPolygons[$thisSpeciesID][$thisPolygon] = $row["Polygon_ID"];
}


// For each polygon in each species, determine whether point is inside that polygon until we find a match
foreach($speciesData as $speciesID => $speciesFields)
{
  $debugOutput .= "Checking species " . $speciesID . " at ".(microtime(true) - $startTime)."<br/>";
  $thisPolygonList = $speciesPolygons[$speciesID];
  $polygonPoints = array( array( array() ) ); // Polygon - boundary - points
  $pointInPolygon = false;
  
  for($polygonIndex = 0; $polygonIndex < count($thisPolygonList); $polygonIndex++)
  {
    $polygonID = $thisPolygonList[$polygonIndex];
  
    // Get polygon data from database
    $debugOutput .= "Getting polygon " . $polygonID . "<br/>";
    // Construct query
    $query = "SELECT Boundary, Phi, Delta ";
    $query .= "FROM polygon_points ";
    $query .= "WHERE Polygon_ID = " . $polygonID;
    $query .= " ORDER BY Boundary, Point_number";
  
    // Execute query
    $queryStartTime = microtime(true);
    $result = $connection->query($query);
    $debugOutput .= "<div>Polygon ".$polygonID." query took " . (microtime(true) - $queryStartTime) . " seconds</div>";
  
    // Extract polygon data
    $pointIndex = 0;
    $currentBoundary = -1;
    
    $getPolyTime = microtime(true);
    $fetchingTime = 0;
    $queryStartTime = microtime(true);
    while($row = $result->fetch_array())
    {
      $fetchingTime += (microtime(true) - $queryStartTime);
      if($row["Boundary"] != $currentBoundary)
      {
        //$debugOutput .= "Point index = " . $pointIndex;
        $pointIndex = 0;
        $currentBoundary = $row["Boundary"];
      }
      else
      {
        $pointIndex++;
      }
      $polygonPoints[$polygonID][$row["Boundary"]][$pointIndex] = array($row["Phi"], $row["Delta"]);
      
      $queryStartTime = microtime(true);
    }
    $fetchingTime += (microtime(true) - $queryStartTime);
    $debugOutput .= "<div>Fetching time for poly ".$polygonID." took " . ($fetchingTime) . " seconds</div>";  
    $debugOutput .= "<div>Total time to get poly ".$polygonID." was " . (microtime(true) - $getPolyTime) . " seconds</div>";  
    
    
    // Check this polygon
    $debugOutput .= "Checking polygon " . $polygonID . "<br/>";
  
    $c = false;

    // Check each boundary
    // Note that latitude and longitude are treated as square 2D Carteisan coordinates for this.
    // This should be acceptable as the points are generally close together compared with the size
    // of the Earth, but will cause problems near the poles!
    // echo "Polygon has " . count($polygonPoints[$polygonID]) . " boundaries<br/>";
    for($boundaryIndex = 0; $boundaryIndex < count($polygonPoints[$polygonID]); $boundaryIndex++)
    {
  
      $thisPointList = $polygonPoints[$polygonID][$boundaryIndex];
      $debugOutput .= "Boundary " . $boundaryIndex . " has " . count($thisPointList) . " points<br/>";

      $nvert = count($thisPointList);        
      $j = 0;
      for($i = 1; $i < $nvert; $i++)
      {  
        $j = $i-1;
        // Perform test to see if we have a line intersect for this side of the polygon
        // with an imaginary line extending due east from the test point
        $vertPhi = $thisPointList[$i][0];
        $vertDelta = $thisPointList[$i][1];
        $lastVertPhi = $thisPointList[$j][0];
        $lastVertDelta = $thisPointList[$j][1];
        //$debugOutput .= "Checking line: " . $i . " to " . $j . "<br/>";
        //$debugOutput .= "Checking line: " . $lastVertPhi . "," . $lastVertDelta . " to " . $vertPhi . "," . $vertDelta . "<br/>";
        if ( (($vertDelta > $testDelta) != ($lastVertDelta > $testDelta)) &&
          ($testPhi < ($lastVertPhi - $vertPhi) * ($testDelta - $vertDelta) / ($lastVertDelta - $vertDelta) + $vertPhi) )
        {
          $c = !$c;
          //$debugOutput .= "Checking line: " . $lastVertPhi . "," . $lastVertDelta . " to " . $vertPhi . "," . $vertDelta . "<br/>";
          $debugOutput .= "Crossing found with point ".$j." to ".$i."<br/>";
        }
      }
  
    }  // End boundary loop
  
    if($c)
    {
      // Point is inside polygon
      addResult($response, $speciesData, $speciesID, 0.0);
      $debugOutput .= "Point inside polygon " . $polygonIndex . "<br/>";
      $pointInPolygon = true;
      break;
    }

  
  }  // End polygon loop


  // Check distance if proximity value specified
  if(!$pointInPolygon && $proximity > 0)
  {
    //echo "Checking distance<br/>";
    $currentDistance = 1000000;
    for($polygonIndex = 0; $polygonIndex < count($thisPolygonList); $polygonIndex++)
    {
      $polygonID = $thisPolygonList[$polygonIndex];

      // Check each boundary
      for($boundaryIndex = 0; $boundaryIndex < count($polygonPoints[$polygonID]); $boundaryIndex++)
      {
      
        $thisPointList = $polygonPoints[$polygonID][$boundaryIndex];
        $debugOutput .= "Boundary " . $boundaryIndex . " has " . count($thisPointList) . " points<br/>";
        $lastVertex = geogToCartesian($thisPointList[0]);
        for($i = 1; $i < count($thisPointList); $i++)
        {  
          $thisVertex = geogToCartesian($thisPointList[$i]);
          // Check distance from line
          $distance = linePointDist($thisVertex, $lastVertex, $testPointCartesian);
          if($distance < $currentDistance)
          {
            $currentDistance = $distance;
          }
          $lastVertex = $thisVertex; // This saves extra operations converting coordinates twice
        }
      }
    }
    
    if($currentDistance < $proximity)
    {
      // Add species to results
      addResult($response, $speciesData, $speciesID, $currentDistance);
    }

  }  // End if

}  // End species loop

// Output time taken for search
$debugOutput .= "<br/><br/>Search took " . (microtime(true) - $startTime) . " seconds<br/>";

// Echo results back to client as JSON
echo json_encode($response);

$connection->close();

// End of main script

function addResult(&$response, &$speciesData, $speciesID, $distance)
{
  $response["results"][] = [
    "speciesID"=>$speciesID,
    "order"=>$speciesData[$speciesID]["Species_order"],
    "family"=>$speciesData[$speciesID]["Species_family"],
    "binomial"=>$speciesData[$speciesID]["Scientific_name"],
    "commonName"=>$speciesData[$speciesID]["Common_name"],
    "threatStatus"=>$speciesData[$speciesID]["GE_score"],
    "distance"=>round($distance)
  ];
}


// 3D funcs
// x = 0, y = 1, z =2
function f3dDot($v1, $v2)
{
    return ($v1[0]*$v2[0] + $v1[1]*$v2[1] + $v1[2]*$v2[2]);
}

function f3dCross($v1, $v2)
{
    return array(($v1[1]*$v2[2] - $v2[1]*$v1[2]), ($v2[0]*$v1[2] - $v1[0]*$v2[2]), ($v1[0]*$v2[1] - $v2[0]*$v1[1]));
}

function f3dLength($v)
{
    return sqrt($v[0]*$v[0] + $v[1]*$v[1] + $v[2]*$v[2]);
}

function geogToCartesian($v)
{
    // As we're dealing in angles, we can take the radius of the Earth to be unity
    $delta = deg2rad($v[1]);
    $phi = deg2rad($v[0]);
    return array(cos($delta)*cos($phi), cos($delta)*sin($phi), sin($delta));
}

// returns array with lat = index 1, long = index 0 (in line with x, y)
function cartesianToGeog($v)
{
    $phi = atan2($v[1], $v[0]);
    $delta = (pi()/2) - atan2(sqrt($v[0]*$v[0] + $v[1]*$v[1]), $v[2]);
    return array(rad2deg($phi), rad2deg($delta));
}

// Compute the distance from line segment AB to C
function linePointDist($v1, $v2, $v0)
{
  global $radiusOfEarthKm;
  global $halfOfEarthCircum;
  global $qtrOfEarthCircum;
  
  $distance = 0;
  
  // Calculate A x B, a vector normal to the plane in which vectors A and B lie (or points A, B, and the origin)
  $normal = f3dCross($v2, $v1);
  
  // Now work out whether the nearest point on line AB is actually between A and B or not.
  // This is achieved by finding normal to the plane containing A and C, and checking the dot product of that
  // and the normal to the plane containing A and B, then likewise for the BC normal to the AB normal. If
  // the signs of the dot products are different, then one is less than pi/2 radians and one is greater,
  // therefore the nearest point (at which the angle must be pi/2) must lie between A and B on the great circle AB.
  $dot1 = f3dDot(f3dCross($v0, $v1), $normal);
  //echo "dot1: " . $dot1 . "<br/>";
  $dot2 = f3dDot(f3dCross($v0, $v2), $normal);
  //echo "dot2: " . $dot2 . "<br/>";
  
  if(($dot1 > 0) != ($dot2 > 0))
  {
    // Calculate (A x B) . C
    $dot = f3dDot($normal, $v0);
    //echo "Dot:".$dot."<br/>";
    // Calculate length of A x B
    $normLength = f3dLength($normal);;
    //echo "Length of normal:".$normLength."<br/>";
    //echo "Length of C:".f3dLength($v0)."<br/>";
    //echo "Sin of angle:".$dot/$lengthAxB."<br/>";
  
    // Calculate distance from C to AB plane over Earth sphere, by finding angle between position vector C
    // and the AB plane.
    // Note: we use arcsin function here, rather than arccos, because the angle between the vector C
    // and the normal to the AB plane is 90 degrees minus the angle between angle between C and the
    // plane itself, so using arcsin takes care of that.
    $distance = $radiusOfEarthKm * abs(asin($dot/$normLength));
    //echo "Distance from line: " . $distance . "<br/>";
    //return $distance;
  }
  else
  {
    // Assume angles < 90 degrees
    if(abs($dot1) < abs($dot2))
    {
      // v1 angle is smaller, so A is nearer
      $distance = $radiusOfEarthKm * abs(acos(f3dDot($v0, $v1)));
      //echo "Distance from A: " . $distance . "<br/>";
      //return $distance;
    }
    else
    {
      $distance = $radiusOfEarthKm * abs(acos(f3dDot($v0, $v2)));
      //echo "Distance from B: " . $distance . "<br/>";
      //return $distance;
    }
  }
  
  //if(f3dDot($v0, $v1) < 0)
  if(f3dDot($v0, $v1) < 0 && $distance < $qtrOfEarthCircum)
  {
    //echo "Adjusted distance<br/>";
    return $halfOfEarthCircum - $distance;
  }
  else
  {
    return $distance;
  }
}

?>
