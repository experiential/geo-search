import React from 'react';
import {connect} from 'react-redux';

import SearchResult from './SearchResult';

const SearchResultsPanel = (props) => {

    if (props.searchResults.results.length > 0) {
        return (
            <div>
                <h5>Search results (click to show species range)</h5>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Species</th>
                        <th>Common name</th>
                        <th>Order</th>
                        <th>Family</th>
                        <th>Threat status</th>
                        <th>Distance in km</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.searchResults.results.map(result => {
                            return (
                                <SearchResult key={result.speciesID} speciesID={result.speciesID} distance={result.distance}/>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (
            <div>
              <h5>Double click on the Earth to search for nearby species.</h5>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {searchResults: state.searchResults};
};

export default connect(mapStateToProps, {})(SearchResultsPanel);
