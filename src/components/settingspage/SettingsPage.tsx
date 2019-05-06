import { Pivot, PivotItem } from "office-ui-fabric-react";
import React, { useState } from "react";
import MagnetizerSettings from "../magnetizerloader/MagnetizerLoader";
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>("mag");

  let selectedView: JSX.Element = <span />;
  switch (selectedTab) {
    case "loc":
      break;
    case "mag":
      selectedView = <MagnetizerSettings />;
      break;
    default:
  }

  function handleTabClick(clickedTab: PivotItem | undefined) {
    if (clickedTab) {
      if (clickedTab.props.itemKey === "Home") {
        window.location.href = window.location.origin;
      }
      setSelectedTab(clickedTab.props.itemKey);
    }
  }

  return (
    <div>
      <Pivot className={styles.pivotContainer} onLinkClick={(item: PivotItem | undefined) => handleTabClick(item)}>
        <PivotItem headerText={"Location"} itemIcon={"Globe"} itemKey={"loc"} />
        <PivotItem headerText={"Magnetizer"} itemIcon={"BranchCompare"} itemKey={"mag"} />
        <PivotItem headerText={"Other"} itemIcon={"ChartSeries"} itemKey={"oth"} />
        <PivotItem headerText={"Home"} itemIcon={"Home"} itemKey={"Home"} />
      </Pivot>
      {selectedView}
    </div>
  );
};

export default SettingsPage;
