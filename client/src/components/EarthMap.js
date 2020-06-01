import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Viewer, ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import * as Cesium from 'cesium';

import { updateResults } from '../actions';


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
      </Viewer>
    );
  }

  searchAtPoint(eventInfo) {
    const viewer = this.viewer;    
    const ellipsoid = viewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position 
    const position = eventInfo.position;
    console.log("x:" + position.x, "y:" + position.y);
    var cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(position.x, position.y), ellipsoid);
    if (cartesian) {
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      console.log("long:" + longitude, "lat:" + latitude);

      // Add marker and range boundary for search
      var range = document.getElementById("rangeField").value;
      var searchMarker = viewer.entities.getById('searchMarker');
      var rangeMarker = viewer.entities.getById('searchRangeMarker');
      if(!searchMarker)
      {
        searchMarker = viewer.entities.add({
          id: 'searchMarker',
          position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
          billboard : {
            image : 'navigation-5109671_1280.png',
            width : 24,
            height : 32
          },
          label : {
            text : 'Search point',
            font : '14pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth : 2,
            verticalOrigin : Cesium.VerticalOrigin.TOP,
            pixelOffset : new Cesium.Cartesian2(0, 32)
          }
        });

        rangeMarker = viewer.entities.add({
          id: 'searchRangeMarker',
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          ellipse : {
            semiMinorAxis : range * 1000.0,
            semiMajorAxis : range * 1000.0,
            material : Cesium.Color.BLUE.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.GREEN,
            outlineWidth: 2.0,
          }
        });
      }
      else
      {
        searchMarker.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
        rangeMarker.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
        rangeMarker.ellipse.semiMinorAxis = range * 1000.0;
        rangeMarker.ellipse.semiMajorAxis = range * 1000.0;
      }

      viewer.zoomTo(viewer.entities);

      // Perform search
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }
}

const mapStateToProps = (state) => {
  return { map: state.map };
};

export default connect(mapStateToProps, { updateResults })(EarthMap);
