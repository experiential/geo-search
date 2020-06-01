import React, { Component } from 'react';

const SearchResult = (props) =>
  <tr>
    <td>{props.result.binomial}</td>
    <td>{props.result.commonName}</td>
    <td>{props.result.distance}</td>
  </tr>

export default SearchResult;