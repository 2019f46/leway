import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { ProjectRouter } from "./routing/ProjectRouter";
initializeIcons("https://static2.sharepointonline.com/files/fabric/assets/icons/");

ReactDOM.render(
    <ProjectRouter />,
    document.getElementById('root')
);

// Register and unregister service worker (Progressive Web application)
serviceWorker.unregister();

