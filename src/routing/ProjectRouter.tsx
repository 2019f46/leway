import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import PageNotFound from "../components/pagenotfound/PageNotFound";
import SettingsPage from "../components/settingspage/SettingsPage";

export class ProjectRouter extends React.Component {
    public render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/home" component={Home} />
                    <Redirect exact from="/" to="/home" />
                    <Route exact path="/settings" component={SettingsPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}
