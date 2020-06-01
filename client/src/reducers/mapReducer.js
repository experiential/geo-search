import { SEARCH_AT_POINT } from '../actions/types';

const INITIAL_STATE = {
	searchPointLon: 0.0,
	searchPointLat: 0.0,
};

export default (state = INITIAL_STATE, action) => {
	switch ( action.type ) {
		case SEARCH_AT_POINT:
			return { 
				...state, 
				searchPointLon: action.payload.searchPointLon, 
				searchPointLat: action.payload.searchPointLat 
			};
		default:
			return state;
	}
};
