import React from 'react';
import { connect } from 'react-redux';
import { Entity, PolygonGraphics } from "resium";
import { Cartesian3, Color, PolygonHierarchy } from 'cesium';

const SpeciesRange = (props) => {
    console.log("Showing range:")
    const species = props.species;
    return(
      <React.Fragment>
      {
        species.geoRange.map( ( polygon, index ) => {

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
            name={species.binomial}
            description={"This shows a region where the species '"+species.binomial+"', or the '" + species.commonName + "', lives"}
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
}


const mapStateToProps = (state, { speciesID }) => {
  return { species: state.species[speciesID] };
};

export default connect(mapStateToProps, { })(SpeciesRange);
