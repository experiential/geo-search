import React from "react";
import { hot } from "react-hot-loader/root";

import EarthMap from "./EarthMap";
import ParameterPanel from "./ParameterPanel";
import SearchResultsPanel from "./SearchResultsPanel";

const App = () => (
	<React.Fragment>
		<div
			className="row py-4"
			style={{
				position: "sticky",
				top: "0px",
				zIndex: "2000",
				backgroundColor: "#000",
			}}
		>
			<div className="col">
				<EarthMap />
			</div>
			<div className="col col-2">
				<ParameterPanel />
			</div>
		</div>
		<div className="row my-4">
			<div className="col">
				<SearchResultsPanel />
			</div>
		</div>
	</React.Fragment>
);

export default hot(App);
