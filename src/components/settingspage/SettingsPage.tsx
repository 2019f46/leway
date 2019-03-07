import React, { PureComponent } from "react";

export interface SettingsPageProps { }

export interface SettingsPageState { }

export default class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {
  public render(): JSX.Element {
    return (
      <div>
        <h1>This is the settings page.</h1>
        <q>You do your settings here</q>
      </div>
    );
  }
}
