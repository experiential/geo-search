import { CHANGE_RANGE, SEARCH_AT_POINT, UPDATE_RESULTS } from './types';

export const changeRange = ( range ) => {
	return {
		type: CHANGE_RANGE,
		payload: { range }
	};
};

export const searchAtPoint = ( longitude, latitude ) => {
	return {
		type: SEARCH_AT_POINT,
		payload: { longitude, latitude }
	};
};

export const updateResults = ( results ) => {
	return {
		type: UPDATE_RESULTS,
		payload: { results }
	};
};

