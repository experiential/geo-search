import { SEARCH_AT_POINT } from '../actions/types';

const INITIAL_STATE = {
	searchPoint: { longitude: 0.0, latitude: 0.0 },
	searchMarkerVisible: false
};

export default (state = INITIAL_STATE, action) => {
	switch ( action.type ) {
		case SEARCH_AT_POINT:
			return { 
				...state, 
				searchPoint: action.payload,
				searchMarkerVisible: true
			};
		default:
			return state;
	}
};
