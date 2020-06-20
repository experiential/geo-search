const { dotProduct, crossProduct, vectorLength, geoToCartesian } = require("./vectors");

// Constants / useful pre-calculated values
const radiusOfEarthKm = 6371.009;
const halfOfEarthCircum = radiusOfEarthKm * Math.PI;
const qtrOfEarthCircum = halfOfEarthCircum / 2;

const pointToPolygonDistance = function(testPoint, polygon) {
    let inside = false;
    let point1 = null;
    polygon.forEach( point2 => {
        // First, we ignore this if it's the first point in the boundary, as we need pairs of points
        if(point2.pointIndex !== 0)
        {
            // Perform test to see if we have a line intersect for this side of the polygon
            // with an imaginary line extending due east from the test point
            //console.log("Checking line ", point1, point2);
            if ( ((point2.delta > testPoint.delta) !== (point1.delta > testPoint.delta)) &&
                (testPoint.phi < (point1.phi - point2.phi) * (testPoint.delta - point2.delta) / (point1.delta - point2.delta) + point2.phi) )
            {
                inside = !inside;
                //$debugOutput .= "Checking line: " . $lastVertPhi . "," . $lastVertDelta . " to " . $vertPhi . "," . $vertDelta . "<br/>";
                //console.log(` -- Crossing found with point ${point1.pointIndex} to ${point2.pointIndex}`);
                //debugData += ` -- Crossing found with point ${point1.pointIndex} to ${point2.pointIndex}`;
            }
        }

        point1 = point2;
    });

    if(inside) {
        // Test point is within this species' range polygon, so update its distance to zero or add it to the list of found species
        return 0.0;
    } else {
        // Test point is outside this polygon, so find distance to polygon
        let distance = halfOfEarthCircum; // Start with maximum possible distance
        let point1 = null;
        polygon.forEach( point2 => {
            // First, we ignore this if it's the first point in the boundary, as we need pairs of points
            if(point2.pointIndex !== 0) {
                // Find distance from point to line
                const distanceToThisLine = pointToLineDistance(testPoint, point1, point2);
                if (distanceToThisLine < distance) { // Math.min slower here, as always assigning?
                    distance = distanceToThisLine;
                }
            }

            point1 = point2;
        });

        return distance;
    }

}

// Compute the distance from line segment AB to C on the surface of a sphere
// Points are assumed to be in geographical coordinates, i.e. latitude and longitude, as point.delta and point.phi
const pointToLineDistance = function(point, linePoint1, linePoint2) {
    // First, convert points to 3D vectors
    const [ vP, vL1, vL2 ] = [ point, linePoint1, linePoint2 ].map( point => geoToCartesian(point) );

    let distance = 0;

    // Calculate A x B, a vector normal to the plane in which vectors A and B lie (or points A, B, and the origin)
    // Note that this is unlikely to be a unit vector, as its length is AB x sin angle AB. Note also that this means
    // that we cannot handle lines where A and B are colinear (either zero angle or 180 degrees). But in that case,
    // A and B do not actually specify a unique line.
    const normal = crossProduct(vL2, vL1);

    // Now work out whether the nearest point on line AB is actually between A and B or not.
    // This is achieved by finding normal to the plane containing A and C, and checking the dot product of that
    // and the normal to the plane containing A and B, then likewise for the BC normal to the AB normal. If
    // the signs of the dot products are different, then one is less than pi/2 radians and one is greater,
    // therefore the nearest point (at which the angle must be pi/2) must lie between A and B on the great circle AB.
    const dot1 = dotProduct(crossProduct(vP, vL1), normal);
    const dot2 = dotProduct(crossProduct(vP, vL2), normal);
    if((dot1 > 0) !== (dot2 > 0)) {
        // Nearest point is indeed between A and B, so calculate dot product of the normal with the point vector, to
        // give us the cosine of the angle between them (as we're using unit vectors).
        // Calculate (A x B) . C
        const dot = dotProduct(normal, vP);
        //echo "Dot:".$dot."<br/>";
        // Calculate length of A x B
        const normLength = vectorLength(normal);

        // Calculate distance from C to AB plane over Earth sphere, by finding angle between position vector C
        // and the AB plane.
        // Note: we use arcsin function here, rather than arccos, because the angle between the vector C
        // and the normal to the AB plane is 90 degrees minus the angle between angle between C and the
        // plane itself, so using arcsin takes care of that.
        distance = radiusOfEarthKm * Math.abs(Math.asin(dot / normLength));
        //echo "Distance from line: " . $distance . "<br/>";
        //return distance;
    } else {
        // The point is closer to line point 1 or line point 2 (not some point between them), so find out which by
        // determining which dot product has an angle closer to a right angle
        // Assume angles < 90 degrees for now
        if(Math.abs(dot1) < Math.abs(dot2)) {
            // v1 angle is smaller, so A is nearer
            distance = radiusOfEarthKm * Math.abs(Math.acos(dotProduct(vP, vL1)));
        } else {
            distance = radiusOfEarthKm * Math.abs(Math.acos(dotProduct(vP, vL2)));
        }
    }

    // Now we need to check for lines that are on the other side of the Earth from the test point, and make adjustments
    // accordingly.
    if(dotProduct(vP, vL1) < 0 && distance < qtrOfEarthCircum)
    {
        //console.log("Adjusted distance: " + halfOfEarthCircum - distance);
        return halfOfEarthCircum - distance;
    }

    //console.log("Distance: "+distance);
    return distance;
}


/*
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

 */

exports.halfOfEarthCircum = halfOfEarthCircum;

exports.pointToPolygonDistance = pointToPolygonDistance;
exports.pointToLineDistance = pointToLineDistance;
