import React from "react";
import { connect } from "react-redux";

import RangeField from "./RangeField";
import CoordinateField from "./CoordinateField";
import SearchButton from "./SearchButton";
import ShowMultiple from "./ShowMultiple";
import ClearButton from "./ClearButton";

const ParameterPanel = props => (
	<div className="container-fluid">
		<div className="row d-none d-md-block pb-1 pb-sm-0">
			<h5>Parameters</h5>
		</div>
		<div className="row pb-1 pb-sm-0">
			<div className="col-3 col-sm-12 pr-0 px-sm-0 mb-1 mb-sm-2">Longitude:</div>
			<div className="col-3 col-sm-12 px-0 mb-1 mb-sm-2">
				<CoordinateField coordinateType={"longitude"}/>
			</div>
			<div className="col-3 col-sm-12 px-0 mb-1 mb-sm-2">Latitude:</div>
			<div className="col-3 col-sm-12 px-0 mb-1 mb-sm-2">
				<CoordinateField coordinateType={"latitude"}/>
			</div>
		</div>
		<div className="row pb-1 pb-sm-0">
			<div className="col-3 col-sm-12 pr-0 px-sm-0 mb-1 mb-sm-2">Range:</div>
			<div className="col-3 col-sm-12 px-0 mb-1 mb-sm-2">
				<RangeField />
			</div>
			<div className="col-6 col-sm-12 px-0 mb-1 my-sm-2 my-md-3 text-center">
				<SearchButton />
			</div>
		</div>
		<div className="row pb-1 pb-sm-0">
			<div className="col-3 col-sm-12 px-0 mb-1 mb-sm-2">
				<ShowMultiple />
			</div>
			<div className="col-6 col-sm-12 px-0 mb-1 my-sm-2 my-md-3 text-center">
				<ClearButton />
			</div>
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
