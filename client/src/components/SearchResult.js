import React from 'react';

const SearchResult = (props) =>
  <tr>
    <td>{props.result.binomial}</td>
    <td>{props.result.commonName}</td>
    <td>{props.result.order}</td>
    <td>{props.result.family}</td>
    <td>{props.result.threatStatus}</td>
    <td>{props.result.distance}</td>
  </tr>

export default SearchResult;