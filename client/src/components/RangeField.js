import React from "react";
import { connect } from "react-redux";

import { changeRange } from "../actions";

const RangeField = props => (
	<div className="input-group">
		<input
			id="rangeField"
			type="number"
			value={props.rangeValue}
			onChange={event => props.changeRange(event.target.value)}
			className="form-control"
		/>
		<div className="input-group-append">
			<span className="input-group-text">km</span>
		</div>
	</div>
);

const mapStateToProps = state => {
	return { rangeValue: state.searchParameters.range };
};

export default connect(
	mapStateToProps,
	{ changeRange },
)(RangeField);
