import React from 'react';
const icon = require("../assets/logo.svg");

export default class Home extends React.Component {
    render() {
        return <div>
            <img src={icon} />
        </div>;
    }
}