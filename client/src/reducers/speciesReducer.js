import {SHOW_SPECIES_RANGE, UPDATE_RESULTS} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    const speciesList = { ...state }; // Copy existing state

    switch
        ( action.type ) {
        case UPDATE_RESULTS:
            console.log("Species reducer called with UPDATE_RESULTS, action.payload is:", action.payload);

            action.payload.results.forEach( (species) => {
                if(!speciesList[species.speciesID]) {
                    speciesList[species.speciesID] = {};
                }
                Object.assign(speciesList[species.speciesID], species);
                console.log("speciesReducer: species now:",speciesList[species.speciesID])
            });
            return speciesList;
        case SHOW_SPECIES_RANGE:
            console.log("Species reducer called with SHOW_SPECIES_RANGE, action.payload is:", action.payload);

            const speciesID = action.payload.speciesID;

            // Here we will assume that, since this is a response that came back from the server and was presumably
            // requested for some reason, we don't need to check whether the range is the same... we can just
            // assume it's different and update the data we have stored for this species.
            //const speciesList = { ...state }; // Copy existing state
            if(!speciesList[speciesID]) {
                speciesList[speciesID] = {};
            }
            speciesList[speciesID].geoRange = action.payload.range;

            return speciesList;

        default:
            return state;
    }
};
