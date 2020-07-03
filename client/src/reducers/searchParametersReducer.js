import {
	CHANGE_RANGE,
	CHANGE_LONGITUDE,
	CHANGE_LATITUDE,
	SEARCH_AT_POINT,
} from "../actions/types";

const INITIAL_STATE = {
	range: 1000,
	longitude: 0.0,
	latitude: 0.0,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_RANGE:
			return { ...state, range: action.payload.range };
		case CHANGE_LONGITUDE:
			return { ...state, longitude: action.payload.longitude };
		case CHANGE_LATITUDE:
			return { ...state, latitude: action.payload.latitude };
		case SEARCH_AT_POINT:
			//return { ...state, longitude: action.payload.longitude, latitude: action.payload.latitude };
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
