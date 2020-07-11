import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Viewer, ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import * as Cesium from "cesium";

import SearchMarker from "./SearchMarker";
import SpeciesRange from "./SpeciesRange";
import {updateResults, searchAtPoint, hideSpeciesRange} from "../actions";
import { geoSearch } from "../sideEffects";

const EarthMap = props => {
	// Get reference to Cesium Viewer object
	const ref = useRef(null);

	// Unfortunately, Cesium's infoBox is hard to customise. We have to do some messing around to get links in the
	// infoBox to dispatch an action. First we need a reference to the Cesium viewer object once it has been created.
	useEffect( () => {
		const viewer = ref.current.cesiumElement;
		// The line below will stop the info box from showing (though also stops the search from working)
		//viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

		// Now we add a load event listener to the infoBox frame, otherwise any changes we make get overwritten when
		// the infoBox is populated.
		viewer.infoBox.frame.addEventListener('load', function() {
			// Set permissions on the infoBox iframe to allow events to be fired, and add event listener to handle
			// the 'hide species' link.
			viewer.infoBox.frame.setAttribute('sandbox', 'allow-same-origin allow-popups allow-forms allow-scripts allow-top-navigation');
			viewer.infoBox.frame.contentDocument.body.addEventListener('click', function(e) {
				if (e.target && e.target.className === 'hide-species-link') {
					const speciesID = parseInt(e.target.getAttribute("data-species-id"));
					if(!isNaN(speciesID)) {
						props.hideSpeciesRange(speciesID);
					}
				}
			}, false);
		}, false);
	}, []);

	return (
		<Viewer ref={ref}>
			<ScreenSpaceEventHandler>
				<ScreenSpaceEvent
					action={evt =>
						mapClicked(evt, ref.current.cesiumElement, props)
					}
					type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
				/>
			</ScreenSpaceEventHandler>
			<SearchMarker />
			{props["map"].speciesVisible.map(speciesID => {
				console.log("EarthMap: Species ID: ", speciesID);
				return <SpeciesRange key={speciesID} speciesID={speciesID} />;
			})}
		</Viewer>
	);
};

const mapClicked = (
	eventInfo,
	viewer,
	{ searchAtPoint, searchParameters, updateResults },
) => {
	if(viewer.infoBox) {
		viewer.infoBox.frame.sandbox = "allow-scripts";
	} else {
		console.log("infoBox object doesn't exist!!!!");
	}
	const ellipsoid = viewer.scene.globe.ellipsoid;
	// Mouse over the globe to see the cartographic position
	const position = eventInfo.position;
	console.log("x:" + position.x, "y:" + position.y);
	const cartesian = viewer.camera.pickEllipsoid(
		new Cesium.Cartesian3(position.x, position.y),
		ellipsoid,
	);
	if (cartesian) {
		const cartographic = ellipsoid.cartesianToCartographic(cartesian);
		const longitude = Cesium.Math.toDegrees(cartographic.longitude);
		const latitude = Cesium.Math.toDegrees(cartographic.latitude);
		console.log("long:" + longitude, "lat:" + latitude);

		// Update state with new search point
		searchAtPoint(longitude, latitude);

		console.log("searchParameters: " + JSON.stringify(searchParameters));
		// Call API to get search results
		geoSearch({ searchPoint: { longitude, latitude}, searchParameters, updateResults });
		/*
		// Perform search
		const range = searchParameters.range;
		///species/geo-search
		//fetch('/geog_search_xml.php?delta='+latitude+'&phi='+longitude+'&range='+range, {
		fetch(
			"/species/geo-search?delta=" +
				latitude +
				"&phi=" +
				longitude +
				"&range=" +
				range,
			{
				method: "GET",
				headers: {},
				body: null,
			},
		)
			.then(response => response.json())
			.then(data => {
				console.log("Success:", data);
				//var results = document.getElementById("results");
				//results.innerHTML = data;
				updateResults(data.results);
				viewer.entities.values.forEach(entity => {
					if (entity.name === "Search range") viewer.zoomTo(entity);
				});
				//viewer.zoomTo(viewer.entities);
			})
			.catch(error => {
				console.error("Error:", error);
			});

		 */
	}
	return true;
};

const mapStateToProps = state => {
	return { map: state.map, searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{ searchAtPoint, updateResults, hideSpeciesRange },
)(EarthMap);
