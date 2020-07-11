import React from "react";
import { connect } from "react-redux";

import { changeShowMultipleRanges } from "../actions";

const ShowMultiple = props => {
	return (
		<React.Fragment>
			<div className="form-check">
				<label className="form-check-label">

					<input
						type="checkbox"
						onClick={event =>
							props.changeShowMultipleRanges(event.target.checked)
						}
						className="form-check-input"
					/>
                    Allow multiple species ranges
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
