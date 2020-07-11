//import * as Cesium from "cesium";

//import { updateResults, searchAtPoint } from "./actions";

export const geoSearch = ({ searchPoint, searchParameters, updateResults }) => {
	// Decompose search parameters
	const { range } = searchParameters;
    let longitude, latitude;
    if(searchPoint === undefined ) {
        ({ longitude, latitude } = searchParameters);
    } else {
        ({ longitude, latitude } = searchPoint);
    }

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
