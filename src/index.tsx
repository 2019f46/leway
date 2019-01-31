import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import Home from './components/Home';

initializeIcons("https://static2.sharepointonline.com/files/fabric/assets/icons/");

ReactDOM.render(<Home />, document.getElementById('root'));

// Register and unregister service worker (Progressive Web application)
serviceWorker.unregister();
