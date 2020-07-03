import React from "react";
import { connect } from "react-redux";

import { selectSpecies, showSpeciesRange } from "../actions";

const SearchResult = props => (
	<tr
		onClick={event =>
			selectSpeciesHandler(
				props.speciesID,
				props.selectSpecies,
				props.showSpeciesRange,
			)
		}
	>
		<td className="d-none d-sm-table-cell">{props.species.binomial}</td>
		<td>{props.species.commonName}</td>
		<td className="d-none d-sm-table-cell">{props.species.order}</td>
		<td className="d-none d-sm-table-cell">{props.species.family}</td>
		<td>{props.species.threatStatus}</td>
		<td>{props.distance}</td>
	</tr>
);

const selectSpeciesHandler = (speciesID, selectSpecies, showSpeciesRange) => {
	//console.log("speciesID=", speciesID);
	//console.log({"url": '/shape_xml.php?id='+speciesID});
	console.log({ url: "/species/" + speciesID + "/geo-range" });
	// Trigger call to retrieve species range data from server
	//fetch('/shape_xml.php?id='+speciesID, {
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
