import { UPDATE_RESULTS } from '../actions/types';

const INITIAL_STATE = {
	results: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_RESULTS:
			return { ...state, results: action.payload.results };
		default:
			return state;
	}
};
