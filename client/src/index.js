import React from "react";
import ReactDOM from "react-dom";
import { Ion } from "cesium";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import App from "./components/App";
import reducers from "./reducers";

Ion.defaultAccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjZmZDQwZC0yYTI3LTQ5NDAtOGMwNi1mZDhlOGQ4MzEwNjQiLCJpZCI6MjYyNTUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODc0ODU0ODl9.UOYgcxeDNryrROwhHJKiwub_SnX07U1dzRSlEVBuSN8";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware()));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("wrapper"),
);
