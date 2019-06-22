import { Pivot, PivotItem } from "office-ui-fabric-react";
import React, { useState } from "react";
import MagnetProductSettings from "../magnetizedproductsettings/MagnetProductSettings";
// import MagnetizerLoader from "../magnetizerloader/MagnetizerLoader";
import styles from "./SettingsPage.module.scss";

/**
 * Component generated using react 16.8 new feature: hooks
 */
const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>("mag");

  let selectedView: JSX.Element = <span />;
  switch (selectedTab) {
    case "loc":
      break;
    case "mag":
      selectedView = <MagnetProductSettings />;
      break;
    default:
  }

  /**
   * This is a method which is triggered when a tab is clicked. 
   * @param clickedTab The tab which is clicked
   */
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
