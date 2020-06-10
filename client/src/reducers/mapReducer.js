import { SEARCH_AT_POINT, SHOW_SPECIES_RANGE } from '../actions/types';

const INITIAL_STATE = {
	searchPoint: { longitude: 0.0, latitude: 0.0 },
	searchMarkerVisible: false,
	speciesRanges: []
};

export default (state = INITIAL_STATE, action) => {
	switch ( action.type ) {
		case SEARCH_AT_POINT:
			return { 
				...state, 
				searchPoint: action.payload,
				searchMarkerVisible: true
			};
		case SHOW_SPECIES_RANGE:
			console.log("Map reducer called with SHOW_SPECIES_RANGE, action.payload is:", action.payload);
			let newSpeciesRanges = [];
			if(state.speciesRanges)
				newSpeciesRanges = [ ...state.speciesRanges ];
			newSpeciesRanges.push({ ...action.payload, visible: true })
			return {
				...state,
				speciesRanges: newSpeciesRanges
			};
		default:
			return state;
	}
};
