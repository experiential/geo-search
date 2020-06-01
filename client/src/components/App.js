import React from 'react';
import { hot } from "react-hot-loader/root";

import EarthMap from './EarthMap';
import ParameterPanel from './ParameterPanel';
import SearchResultsPanel from './SearchResultsPanel';

  
const App = () => 
  <div>
    <EarthMap/>
    <ParameterPanel/>
    <SearchResultsPanel/>
  </div>;


export default hot(App);
