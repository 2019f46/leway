import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import PageNotFound from "../components/pagenotfound/PageNotFound";
import SettingsPage from "../components/settingspage/SettingsPage";
import { Provider } from "react-redux";
import store from "../redux/store";


/**
 * This is the highest ranked component in the application. This component is responsible for reading the current URL and deciding which component to render
 */
export class ProjectRouter extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/home" component={Home} />
                        <Redirect exact from="/" to="/home" />
                        <Route exact path="/settings" component={SettingsPage} />
                        <Route component={PageNotFound} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}
