import React from "react";
import { Route, Switch, Redirect, BrowserRouter, MemoryRouter } from "react-router-dom";
import Home from "../components/Home";
import PageNotFound from "../components/pagenotfound/PageNotFound";

export class ProjectRouter extends React.Component{
    public render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/home" component={Home} />
                        <Redirect exact from="/" to="/home" />
                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
