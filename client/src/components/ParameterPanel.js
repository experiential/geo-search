import React from 'react';
import { connect } from 'react-redux';

import RangeField from './RangeField';


const ParameterPanel = (props) =>
  <div>
    <h2>Parameters</h2>
    <p>Range: <RangeField/>km</p>
  </div>;

const mapStateToProps = (state) => {
  return { searchParameters: state.searchParameters };
};

export default connect(mapStateToProps, { })(ParameterPanel);
