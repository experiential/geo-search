import React from "react";
import { connect } from "react-redux";

import { changeShowMultipleRanges } from "../actions";

const ShowMultiple = props => {
	return (
		<React.Fragment>
			<div className="form-check">
				<label className="form-check-label" title="Allow multiple species ranges to be shown concurrently">

					<input
						type="checkbox"
						onClick={event =>
							props.changeShowMultipleRanges(event.target.checked)
						}
						className="form-check-input"
					/>
                    Multiple ranges
				</label>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = state => {
	return { searchParameters: state.searchParameters };
};

export default connect(
	mapStateToProps,
	{ changeShowMultipleRanges },
)(ShowMultiple);
