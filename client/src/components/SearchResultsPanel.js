import React from 'react';
import { connect } from 'react-redux';

import SearchResult from './SearchResult';

const SearchResultsPanel = (props) =>
  <table>
    <tbody>
      <tr>
        <th>Species</th>
        <th>Common name</th>
        <th>Order</th>
        <th>Family</th>
        <th>Threat status</th>
        <th>Distance</th>
      </tr>
      {
        props.searchResults.results.map( result => { return (
            <SearchResult key={ result } speciesID={ result }/>
        )})
      }
    </tbody>
  </table>

const mapStateToProps = ( state ) => {
  return { searchResults: state.searchResults };
};

export default connect(mapStateToProps, { })(SearchResultsPanel);
