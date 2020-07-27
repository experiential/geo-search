import {
	CHANGE_COORDINATE,
	SEARCH_AT_POINT,
	SHOW_SPECIES_RANGE,
	HIDE_SPECIES_RANGE,
	CLEAR_RANGES,
	CHANGE_SHOW_MULTIPLE_RANGES,
} from "../actions/types";

const INITIAL_STATE = {
	//searchPoint: { longitude: 0.0, latitude: 0.0 },
	searchMarkerVisible: false,
	speciesVisible: [],
	showMultipleRanges: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_COORDINATE:
		case SEARCH_AT_POINT: {
			return {
				...state,
				searchMarkerVisible: true, // Just make sure we're showing the search marker
			};
		}
		case SHOW_SPECIES_RANGE: {
			console.log(
				"Map reducer called with SHOW_SPECIES_RANGE, action.payload is:",
				action.payload,
			);

			// Create new version of the list of species ranges visible
			let newVisibleList = [];
			const speciesID = action.payload.speciesID;

			// Determine whether the 'show multiple' box is checked; if not, we just leave the new list empty.
			if(state.showMultipleRanges) {
				// Copy current visible species list state
				if (state.speciesVisible)
					newVisibleList = [...state.speciesVisible];

				// If the specified species is already in the list, remove it before adding to the top of the list.
				// This is in case we show the species in a list: they should be in order of selection. It's also
				// useful for showing just the latest selection when the 'show multiple' is unchecked with multiple
				// species showing.
				const existingIndex = newVisibleList.indexOf(speciesID);
				if (existingIndex !== -1) {
					newVisibleList.splice(existingIndex, 1);
				}
			}

			// Now just add the selected species to the list
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
			console.log(
				"SpeciesVisible:",
				state.speciesVisible ? state.speciesVisible : " is undefined",
			);

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
		case CLEAR_RANGES: {
			console.log(
				"Map reducer called with CLEAR_RANGES, action.payload is:",
				action.payload,
			);

			if (state.speciesVisible && state.speciesVisible.length > 0) {
				return {
					...state,
					speciesVisible: [],
				};
			}
			return state;
		}
		case CHANGE_SHOW_MULTIPLE_RANGES: {
			console.log(
				"Map reducer called with CHANGE_SHOW_MULTIPLE_RANGES, action.payload is:",
				action.payload,
			);

			// Copy existing species list
			let newVisibleList = [...state.speciesVisible];

			// If multiple has been turned off, we may need to slim down the visible species list
			if(!action.payload.allowMultiple && state.speciesVisible.length > 1) {
				newVisibleList = newVisibleList.slice(-1);
			}

			return {
				...state,
				speciesVisible: newVisibleList,
				showMultipleRanges: action.payload.allowMultiple,
			};
		}
		default: {
			return state;
		}
	}
};
