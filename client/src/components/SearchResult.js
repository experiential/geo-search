import React from 'react';
import { connect } from 'react-redux';

import { selectSpecies, showSpeciesRange } from '../actions';


const SearchResult = (props) =>
  <tr onClick={ (event) => selectSpeciesHandler(props.result.speciesID, props.selectSpecies, props.showSpeciesRange) }>
    <td>{props.result.binomial}</td>
    <td>{props.result.commonName}</td>
    <td>{props.result.order}</td>
    <td>{props.result.family}</td>
    <td>{props.result.threatStatus}</td>
    <td>{props.result.distance}</td>
  </tr>

const selectSpeciesHandler = ( speciesID, selectSpecies, showSpeciesRange ) =>
{
	//console.log("speciesID=", speciesID);
	console.log({"url": '/shape_xml.php?id='+speciesID});
	// Trigger call to retrieve species range data from server
	fetch('/shape_xml.php?id='+speciesID, {
		method: 'GET',
		headers: {},
		body: null,
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		//var results = document.getElementById("results");
		//results.innerHTML = data;
		showSpeciesRange(data.speciesID, data.range);
		//viewer.zoomTo(viewer.entities);
	})
	.catch((error) => {
		console.error('Error:', error);
	});

	// Call action creator function
	selectSpecies(speciesID);
}

export default connect(null, { selectSpecies, showSpeciesRange })(SearchResult);
