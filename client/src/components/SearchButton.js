import React from "react";
import { connect } from "react-redux";

import { updateResults } from "../actions";
import { geoSearch } from "../sideEffects";

const SearchButton = props => {
	const { searchParameters, updateResults } = props;
	return (
		<React.Fragment>
			<button
				onClick={event =>
					geoSearch({ searchParameters, updateResults })
				}
				className="btn btn-primary w-75"
			>
				Search
			</button>
		</React.Fragment>
	);
};

const mapStateToProps = state => {
	return { searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{ updateResults },
)(SearchButton);
