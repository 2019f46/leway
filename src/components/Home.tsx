import React from "react";
import { RouteComponentProps } from 'react-router';
import icon from "../assets/logo.svg";
import fs from "fs-extra";
export interface IHomeProps {

}

export interface IHomeState {

}

export default class Home extends React.Component<IHomeProps, IHomeState>{
    render() {
        return (
            <div>
                <img src={icon} />
            </div>
        );
    }
}