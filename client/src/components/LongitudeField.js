import React, { useState } from "react";
import { connect } from "react-redux";

import { changeLongitude } from "../actions";

const LongitudeField = props => {
	const [focus, setFocus] = useState(false);
	let degreeText = null;
	if (!focus) {
		degreeText = <span>&deg;{props.longitudeValue >= 0 ? "E" : "W"}</span>;
	}
	return (
		<React.Fragment>
			<div className="input-group">
				<input
					id="longitudeField"
					type="number"
					value={
						focus
							? props.longitudeValue
							: Math.abs(props.longitudeValue)
					}
					onFocus={event => setFocus(true)}
					onBlur={event => setFocus(false)}
					onChange={event =>
						props.changeLongitude(parseFloat(event.target.value))
					}
					className="form-control"
				/>
				<div className="input-group-append">
					<span className="input-group-text">{degreeText}</span>
				</div>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = state => {
	return { longitudeValue: state.searchParameters.longitude };
};

export default connect(
	mapStateToProps,
	{ changeLongitude },
)(LongitudeField);
