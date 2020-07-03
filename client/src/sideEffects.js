//import * as Cesium from "cesium";

//import { updateResults, searchAtPoint } from "./actions";

export const geoSearch = ({ searchParameters, updateResults }) => {
	// Decompose search parameters
	const { latitude, longitude, range } = searchParameters;

	// Perform search
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
			//viewer.entities.values.forEach(entity => {
			//	if (entity.name === "Search point") viewer.zoomTo(entity);
			//});
		})
		.catch(error => {
			console.error("Error:", error);
		});
};
