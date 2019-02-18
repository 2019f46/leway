import React, { PureComponent } from "react";

export interface SettingsPageProps {}

export interface SettingsPageState {}

class SettingsPage extends React.Component<
  SettingsPageProps,
  SettingsPageState
> {
  render() {
    return (
      <div>
        <h1>This is the settings page.</h1>
        <q>You do your settings here</q>
      </div>
    );
  }
}

export default SettingsPage;
