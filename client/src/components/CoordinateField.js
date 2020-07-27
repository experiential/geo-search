import React, { useState } from "react";
import { connect } from "react-redux";

import { changeCoordinate } from "../actions";

const directions = {
	longitude: ["E", "W", "w"],
	latitude: ["S", "N", "N"],
};

const CoordinateField = props => {
	const [focus, setFocus] = useState(false);
	let degreeText = null;

	if (!focus) {
		degreeText = (
			<span>
				&deg;{getDirection(props.coordinateType, props.coordinateValue)}
			</span>
		);
	}
	return (
		<div className="input-group">
			<input
				id="longitudeField"
				type="number"
				value={
					focus
						? props.coordinateValue
						: Math.abs(props.coordinateValue)
				}
				onFocus={event => setFocus(true)}
				onBlur={event => setFocus(false)}
				onChange={event => {
				    let floatValue = parseFloat(event.target.value);
				    if(isNaN(floatValue)) {
				        //floatValue = 0.0;
                        return;
                    }
					props.changeCoordinate(
						props.coordinateType,
						parseFloat(floatValue),
					);
				}}
				className="form-control"
			/>
			<div className="input-group-append">
				<span className="input-group-text">{degreeText}</span>
			</div>
		</div>
	);
};

const getDirection = (coordinateType, coordinateValue) => {
	// Get E/W/N/S direction with sign function, adding 1 to get value range of 0 to 2
	return directions[coordinateType][Math.sign(coordinateValue) + 1];
};

const mapStateToProps = (state, { coordinateType }) => {
	return { coordinateValue: state.searchParameters[coordinateType] };
};

export default connect(
	mapStateToProps,
	{ changeCoordinate },
)(CoordinateField);
