import React, { Component } from 'react';
import { connect } from 'react-redux';

import SearchResult from './SearchResult';

const SearchResultsPanel = (props) =>
  <table>
    <tbody>
      <tr><th>Species</th><th>Common name</th><th>Distance</th></tr>
      {
        props.searchResults.results.map( result => { return (
            <SearchResult key={ result.speciesID } result={ result }/>
        )})
      }
    </tbody>
  </table>

// // Comment to sort out highlighting in Sublime
const mapStateToProps = (state) => {
  return { searchResults: state.searchResults };
};

export default connect(mapStateToProps, { })(SearchResultsPanel);
