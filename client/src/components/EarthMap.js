import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Viewer, ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import * as Cesium from 'cesium';

import SearchMarker from './SearchMarker';
import SpeciesRange from './SpeciesRange';
import { updateResults, searchAtPoint } from '../actions';


const EarthMap = (props) => {
  const ref = useRef(null);

  return (
    <Viewer ref={ref}>
      <ScreenSpaceEventHandler>
        <ScreenSpaceEvent action={(evt) => geoSearch(evt, ref.current.cesiumElement, props)} type={Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK} />
      </ScreenSpaceEventHandler>
      <SearchMarker/>
      {
        props["map"].speciesVisible.map( speciesID => {
          console.log("EarthMap: Species ID: ", speciesID);
          console.log("EarthMap: this.props.species: ", props.species);
          return (
          <SpeciesRange key={ speciesID } speciesID={ speciesID }/>
        )})
      }
    </Viewer>
  );
}

const geoSearch = (eventInfo, viewer, { searchAtPoint, searchParameters, updateResults }) => {
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
    searchAtPoint(longitude, latitude);

    // Perform search
    const range = searchParameters.range;
    ///species/geo-search
    //fetch('/geog_search_xml.php?delta='+latitude+'&phi='+longitude+'&range='+range, {
    fetch('/species/geo-search?delta='+latitude+'&phi='+longitude+'&range='+range, {
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
      updateResults(data.results);
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


const mapStateToProps = (state) => {
  return { map: state.map, searchParameters: state.searchParameters };
};

export default connect(mapStateToProps, { searchAtPoint, updateResults })(EarthMap);
