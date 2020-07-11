import React, { useState } from "react";
import { connect } from "react-redux";

import { changeLatitude } from "../actions";

const LatitudeField = props => {
	const [focus, setFocus] = useState(false);
	let degreeText = null;
	if (!focus) {
		degreeText = <span>&deg;{props.latitudeValue >= 0 ? "N" : "S"}</span>;
	}
	return (
		<React.Fragment>
			<div className="input-group">
				<input
					id="latitudeField"
					type="number"
					value={
						focus ? props.latitudeValue : Math.abs(props.latitudeValue)
					}
					onFocus={event => setFocus(true)}
					onBlur={event => setFocus(false)}
					onChange={event =>
						props.changeLatitude(parseFloat(event.target.value))
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
	return { latitudeValue: state.searchParameters.latitude };
};

export default connect(
	mapStateToProps,
	{ changeLatitude },
)(LatitudeField);
