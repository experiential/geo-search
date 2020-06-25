import {
	CHANGE_RANGE,
	SEARCH_AT_POINT,
	UPDATE_RESULTS,
	SELECT_SPECIES,
	SHOW_SPECIES_RANGE,
} from "./types";

export const changeRange = range => {
	return {
		type: CHANGE_RANGE,
		payload: { range },
	};
};

export const searchAtPoint = (longitude, latitude) => {
	return {
		type: SEARCH_AT_POINT,
		payload: { longitude, latitude },
	};
};

export const updateResults = results => {
	return {
		type: UPDATE_RESULTS,
		payload: { results },
	};
};

export const selectSpecies = speciesID => {
	return {
		type: SELECT_SPECIES,
		payload: { speciesID },
	};
};

export const showSpeciesRange = (speciesID, range) => {
	console.log(
		"Action creator showSpeciesRange called with ",
		speciesID,
		"and",
		range,
	);
	return {
		type: SHOW_SPECIES_RANGE,
		payload: { speciesID, range },
	};
};
