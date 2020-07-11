import { SHOW_SPECIES_RANGE, UPDATE_RESULTS } from "../actions/types";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
	const speciesList = { ...state }; // Copy existing state

	switch (action.type) {
		case UPDATE_RESULTS:
			console.log(
				"Species reducer called with UPDATE_RESULTS, action.payload is:",
				action.payload,
			);

			action.payload.results.forEach(species => {
				// Check whether species data from DB is different from whatever we currently have... only update if it
				// has changed to avoid triggering unnecessary React DOM updates
				const speciesFields = [
					"speciesID",
					"order",
					"family",
					"binomial",
					"commonName",
					"threatStatus",
				];
				const speciesDataSubset = pick(species, speciesFields);
				if (
					!isEqual(
						speciesDataSubset,
						pick(speciesList[species.speciesID], speciesFields),
					)
				) {
					speciesList[species.speciesID] = Object.assign(
						{},
						speciesList[species.speciesID],
						speciesDataSubset,
					);
					console.log(
						"speciesReducer: species now:",
						speciesList[species.speciesID],
					);
				}
			});
			return speciesList;

		case SHOW_SPECIES_RANGE:
			console.log(
				"Species reducer called with SHOW_SPECIES_RANGE, action.payload is:",
				action.payload,
			);

			const speciesID = action.payload.speciesID;

			if (action.payload.range) {
				// Here we will assume that, since this is a response that came back from the server and was presumably
				// requested for some reason, we don't need to check whether the range is the same... we can just
				// assume it's different and update the data we have stored for this species.
				//const speciesList = { ...state }; // Copy existing state
				if (!speciesList[speciesID]) {
					speciesList[speciesID] = {};
				}
				speciesList[speciesID].geoRange = action.payload.range;

				return speciesList;
			}
			return state;

		default:
			return state;
	}
};
