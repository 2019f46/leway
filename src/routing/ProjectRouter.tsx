import React from "react";
import { Route, Switch, Redirect, BrowserRouter, MemoryRouter } from 'react-router-dom';
import Home from "../components/Home";
import PageNotFound from "../components/pagenotfound/PageNotFound";
import SettingsPage from "../components/settingspage/SettingsPage";
import createBrowserHistory from 'history/createBrowserHistory'

export class ProjectRouter extends React.Component{

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path='/home' component={Home} />
                        <Redirect exact from="/" to="/home" />
                        <Route exact path='/settings' component={SettingsPage}/>
                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
};