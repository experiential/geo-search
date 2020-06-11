import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Viewer, ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import * as Cesium from 'cesium';

import SearchMarker from './SearchMarker';
import SpeciesRange from './SpeciesRange';
import { updateResults, searchAtPoint } from '../actions';


class EarthMap extends Component {

  render() {
    return (
      <Viewer ref={e => {
          console.log("e.cesiumElement", e, e ? e.cesiumElement : undefined);
          this.viewer = e ? e.cesiumElement : undefined;
        }}>
        <ScreenSpaceEventHandler>
          <ScreenSpaceEvent action={(evt) => this.searchAtPoint(evt)} type={Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK} />
        </ScreenSpaceEventHandler>
        <SearchMarker/>
        {
          this.props["map"].speciesVisible.map( speciesID => {
            console.log("EarthMap: Species ID: ", speciesID);
            console.log("EarthMap: this.props.species: ", this.props.species);
            return (
            <SpeciesRange key={ speciesID } speciesID={ speciesID }/>
          )})
        }
      </Viewer>
    );
  }

  searchAtPoint(eventInfo) {
    const viewer = this.viewer;    
    const ellipsoid = viewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position 
    const position = eventInfo.position;
    console.log("x:" + position.x, "y:" + position.y);
    const cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(position.x, position.y), ellipsoid);
    if (cartesian) {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      console.log("long:" + longitude, "lat:" + latitude);

      // Update state with new search point
      this.props.searchAtPoint(longitude, latitude);

      // Perform search
      const range = this.props.searchParameters.range;
      fetch('/geog_search_xml.php?delta='+latitude+'&phi='+longitude+'&range='+range, {
        method: 'GET',
        headers: {
        },
        body: null,
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        //var results = document.getElementById("results");
        //results.innerHTML = data;
        this.props.updateResults(data.results);
        viewer.entities.values.forEach((entity) => {
          if(entity.name === "Search range")
            viewer.zoomTo(entity);
        })
        //viewer.zoomTo(viewer.entities);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }
}

const mapStateToProps = (state) => {
  return { map: state.map, searchParameters: state.searchParameters };
};

export default connect(mapStateToProps, { searchAtPoint, updateResults })(EarthMap);
