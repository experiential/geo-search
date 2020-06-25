import React from "react";
import { connect } from "react-redux";

import RangeField from "./RangeField";

const ParameterPanel = props => (
	<div>
		<h5>Parameters</h5>
		<p>Range:</p>
		<p>
			<RangeField /> km
		</p>
	</div>
);

const mapStateToProps = state => {
	return { searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{},
)(ParameterPanel);
