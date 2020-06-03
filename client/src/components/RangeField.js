import React from 'react';
import { connect } from 'react-redux';

import { changeRange } from '../actions';


const RangeField = (props) =>
	<input
		id="rangeField"
		type="number"
		value={props.rangeValue}
		onChange={ (event) => props.changeRange(event.target.value) }
	/>

const mapStateToProps = (state) => {
  return { rangeValue: state.searchParameters.range };
};

export default connect(mapStateToProps, { changeRange })(RangeField);
