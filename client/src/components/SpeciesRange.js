import React from 'react';
//import { connect } from 'react-redux';
import { Entity, PolygonGraphics } from "resium";
import { Cartesian3, Color, PolygonHierarchy } from 'cesium';

const SpeciesRange = (props) => {
  if(props.range.visible) { 

    return(
      <React.Fragment>
      {
        props.range.range.map( ( polygon, index ) => { 

          // Build polygon hierarchy
          const hierarchy = new PolygonHierarchy(
            Cartesian3.fromDegreesArray(polygon[0])
          );
          if(polygon.length > 1)
            hierarchy.holes = polygon.slice(1).map( boundary => new PolygonHierarchy( Cartesian3.fromDegreesArray(boundary) ) );

          // Return polygon component
          return (
          <Entity
            key={index}
            name="Species range"
            description="This shows the area around the search point within the range you specified"
          >
            <PolygonGraphics
              hierarchy={hierarchy}
              material={Color.GREEN.withAlpha(0.3)}
              extrudedHeight={1000.0}
              outline
              outlineColor={Color.YELLOW}
              outlineWidth={50.0}
            />
          </Entity>
        )})
      }
      </React.Fragment>
    );
  } else {
    return null;
  }
}

export default SpeciesRange;
/*
const mapStateToProps = (state) => {
  return { visible: state.map.searchMarkerVisible, searchPoint: state.map.searchPoint, range: state.searchParameters.range };
};

export default connect(mapStateToProps, { })(SearchMarker);
*/