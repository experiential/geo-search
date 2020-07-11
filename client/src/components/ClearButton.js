import React from "react";
import { connect } from "react-redux";

import { clearRanges } from "../actions";

const ClearButton = props => {
	const { clearRanges } = props;
	return (
		<React.Fragment>
			<button
				onClick={() => clearRanges()}
				className="btn btn-warning w-75"
			>
				Clear
			</button>
		</React.Fragment>
	);
};

const mapStateToProps = state => {
	return { searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{ clearRanges },
)(ClearButton);
