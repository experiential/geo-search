import React from 'react';
import {connect} from 'react-redux';

import SearchResult from './SearchResult';

const SearchResultsPanel = (props) => {

    if (props.searchResults.results.length > 0) {
        return (
            <div>
                <h5>Search results</h5>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Species</th>
                        <th>Common name</th>
                        <th>Order</th>
                        <th>Family</th>
                        <th>Threat status</th>
                        <th>Distance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.searchResults.results.map(result => {
                            return (
                                <SearchResult key={result} speciesID={result}/>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return null;
    }
}

const mapStateToProps = (state) => {
    return {searchResults: state.searchResults};
};

export default connect(mapStateToProps, {})(SearchResultsPanel);
