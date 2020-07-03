import React from "react";
import { connect } from "react-redux";

import RangeField from "./RangeField";
import LongitudeField from "./LongitudeField";
import LatitudeField from "./LatitudeField";
import SearchButton from "./SearchButton";

const ParameterPanel = props => (
	<div>
		<h5>Parameters</h5>
		<div>
			Longitude:
			<br />
			<LongitudeField />
		</div>
		<div>
			Latitude:
			<br />
			<LatitudeField />
		</div>
		<div>
			Range:
			<br />
			<RangeField /> km
		</div>
		<div>
			<SearchButton />
		</div>
	</div>
);

const mapStateToProps = state => {
	return { searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{},
)(ParameterPanel);
