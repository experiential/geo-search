import {
	CHANGE_RANGE,
	CHANGE_COORDINATE,
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
		case CHANGE_COORDINATE:
			const newState = { ...state };
			if(["latitude", "longitude"].includes(action.payload.coordinateType)) {
				newState[action.payload.coordinateType] = action.payload.coordinateValue;
				return newState;
			}
			return state;
		case SEARCH_AT_POINT:
			//return { ...state, longitude: action.payload.longitude, latitude: action.payload.latitude };
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
