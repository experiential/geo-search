import React from "react";
import { hot } from "react-hot-loader/root";

import EarthMap from "./EarthMap";
import ParameterPanel from "./ParameterPanel";
import SearchResultsPanel from "./SearchResultsPanel";

const App = () => (
	<React.Fragment>
		<div
			className="row pb-sm-2 py-md-4"
			style={{
				position: "sticky",
				top: "0px",
				zIndex: "200",
				backgroundColor: "#000",
			}}
		>
			<div className="col-sm-10 px-0 px-md-3 mb-4 mb-sm-0">
				<EarthMap />
			</div>
			<div className="col-sm-2 mt-sm-2 pl-sm-2 px-md-3 mt-md-0">
				<ParameterPanel />
			</div>
		</div>
		<div className="row my-4">
			<div className="col-sm">
				<SearchResultsPanel />
			</div>
		</div>
	</React.Fragment>
);

export default hot(App);
