import { CHANGE_RANGE } from '../actions/types';

const INITIAL_STATE = {
	range: 1000,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_RANGE:
			return { ...state, range: action.payload.range };
		default:
			return state;
	}
};
