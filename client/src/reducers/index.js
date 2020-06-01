import { combineReducers } from 'redux';
import mapReducer from './mapReducer';
import searchParametersReducer from './searchParametersReducer';
import searchResultsReducer from './searchResultsReducer';

export default combineReducers({
	map: mapReducer,
	searchParameters: searchParametersReducer,
	searchResults: searchResultsReducer
});
