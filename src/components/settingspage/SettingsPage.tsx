import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { useState } from "react";
import MagnetizerSettings from '../magnetizersettings/MagnetizerSettings';
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState("loc");

  let selectedView: JSX.Element = <span />;
  switch (selectedTab) {
    case "loc":
      break;
    case "mag":
      selectedView = <MagnetizerSettings />;
      break;
    default:

  }

  function handleClick(item: PivotItem | undefined) {
    if (item) {
      setSelectedTab(item.props.itemKey as any);
    }
  };

  return (
    <div>
      <Pivot className={styles.pivotContainer} onLinkClick={(item: PivotItem | undefined) => handleClick(item)}>
        <PivotItem headerText={"Location"} itemIcon={"Globe"} itemKey={"loc"} />
        <PivotItem headerText={"Magnetizer"} itemIcon={"BranchCompare"} itemKey={"mag"} />
        <PivotItem headerText={"Other"} itemIcon={"ChartSeries"} itemKey={"oth"} />
      </Pivot>
      {selectedView}
    </div>
  );
}

export default SettingsPage;