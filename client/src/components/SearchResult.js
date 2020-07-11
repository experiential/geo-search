import React from "react";
import { connect } from "react-redux";

import { selectSpecies, showSpeciesRange } from "../actions";

const SearchResult = props => (
	<tr onClick={event => selectSpeciesHandler(props)}>
		<td className="d-none d-sm-table-cell">{props.species.binomial}</td>
		<td>{props.species.commonName}</td>
		<td className="d-none d-sm-table-cell">{props.species.order}</td>
		<td className="d-none d-sm-table-cell">{props.species.family}</td>
		<td>{props.species.threatStatus}</td>
		<td>{props.distance}</td>
	</tr>
);

const selectSpeciesHandler = ({
	speciesID,
	species,
	selectSpecies,
	showSpeciesRange,
}) => {
	// Check whether we need to download the species range data from the server, or it's already there
	if (species.geoRange && species.geoRange.length > 0) {
		showSpeciesRange(speciesID, null);
	} else {
		// Trigger call to retrieve species range data from server
		console.log({ url: "/species/" + speciesID + "/geo-range" });
		fetch("/species/" + speciesID + "/geo-range", {
			method: "GET",
			headers: {},
			body: null,
		})
			.then(response => response.json())
			.then(data => {
				console.log("Success:", data);
				//var results = document.getElementById("results");
				//results.innerHTML = data;
				showSpeciesRange(data.speciesID, data.range);
				//viewer.zoomTo(viewer.entities);
			})
			.catch(error => {
				console.error("Error:", error);
			});
	}

	// Call action creator function
	selectSpecies(speciesID);
};

const mapStateToProps = (state, { speciesID }) => {
	return { species: state.species[speciesID] };
};

export default connect(
	mapStateToProps,
	{ selectSpecies, showSpeciesRange },
)(SearchResult);
