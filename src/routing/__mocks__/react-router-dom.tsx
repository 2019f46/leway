import React from 'react';
const routerDOM = require("react-router-dom");

// This is mocked, otherwise we cannot use memory browser, as there will be an overlap and the init prop wont be parsed.
routerDOM.BrowserRouter = ({ children }: { children: any }) => {
    return <div>{children}</div>;
}

module.exports = routerDOM;