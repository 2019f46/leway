import { Pivot, PivotItem } from "office-ui-fabric-react";
import React, { useState } from "react";
import MagnetizerLoader from "../magnetizerloader/MagnetizerLoader";
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>("mag");

  let selectedView: JSX.Element = <span />;
  switch (selectedTab) {
    case "loc":
      break;
    case "mag":
      selectedView = <MagnetizerLoader />;
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
        <PivotItem headerText={"Magnetizer"} itemIcon={"BranchCompare"} itemKey={"mag"} />
        <PivotItem headerText={"Location"} itemIcon={"Globe"} itemKey={"loc"} headerButtonProps={{ disabled: true }} />
        <PivotItem headerText={"Other"} itemIcon={"ChartSeries"} itemKey={"oth"} headerButtonProps={{ disabled: true }} />
        <PivotItem headerText={"Home"} itemIcon={"Home"} itemKey={"Home"} />
      </Pivot>
      {selectedView}
    </div>
  );
};

export default SettingsPage;
