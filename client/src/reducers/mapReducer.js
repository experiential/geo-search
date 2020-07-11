import {
	CHANGE_LONGITUDE,
	CHANGE_LATITUDE,
	SEARCH_AT_POINT,
	SHOW_SPECIES_RANGE,
	HIDE_SPECIES_RANGE,
} from "../actions/types";

const INITIAL_STATE = {
	//searchPoint: { longitude: 0.0, latitude: 0.0 },
	searchMarkerVisible: false,
	speciesVisible: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_LONGITUDE:
		case CHANGE_LATITUDE:
		case SEARCH_AT_POINT: {
			return {
				...state,
				searchMarkerVisible: true,
			};
		}
		case SHOW_SPECIES_RANGE: {
			console.log(
				"Map reducer called with SHOW_SPECIES_RANGE, action.payload is:",
				action.payload,
			);

			let newVisibleList = [];
			if (state.speciesVisible)
				newVisibleList = [...state.speciesVisible];
			const speciesID = action.payload.speciesID;

			const existingIndex = newVisibleList.indexOf(speciesID);
			if (existingIndex !== -1) {
				newVisibleList.splice(existingIndex, 1);
			}
			newVisibleList.push(speciesID);
			return {
				...state,
				speciesVisible: newVisibleList,
			};
		}
		case HIDE_SPECIES_RANGE: {
			console.log(
				"Map reducer called with HIDE_SPECIES_RANGE, action.payload is:",
				action.payload,
			);
			console.log("SpeciesVisible:", state.speciesVisible ? state.speciesVisible : " is undefined");

			let newVisibleList = [];
			if (state.speciesVisible)
				newVisibleList = [...state.speciesVisible];
			const speciesID = parseInt(action.payload.speciesID);

			const existingIndex = newVisibleList.indexOf(speciesID);
			if (existingIndex !== -1) {
				newVisibleList.splice(existingIndex, 1);
				return {
					...state,
					speciesVisible: newVisibleList,
				};
			}
			return state;
		}
		default: {
			return state;
		}
	}
};
