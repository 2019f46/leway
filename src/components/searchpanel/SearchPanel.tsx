import { IconButton, Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";
import ProductSearch from "../productsearch/ProductSearch";
import styles from "./SearchPanel.module.scss";

/** This interface holds the states of the seachpanel */
export interface ISearchPanelState {
  isOpen: boolean;
}

/** This component is responsible for rending a panel which can be shown/hidden with the product search functionality. */
class SearchPanel extends React.Component<{}, ISearchPanelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  /** Lifecycle component, triggered when the component initially loads into the DOM */
  public componentDidMount() {
    window.addEventListener("resize", this.update, false);
  }

  /**
   * Lifecycle method, triggered when the component is preparing to dismount
   */
  public componentWillUnmount() {
    window.removeEventListener("resize", this.update);
  }

  /**
   * Force an update of the UI
   */
  private update = () => {
    this.forceUpdate();
  };

  public render() {
    const { isOpen } = this.state;
    let iconString = isOpen ? (window.innerWidth < window.innerHeight ? "Up" : "Back") : "Search";

    let icon: JSX.Element = (
      <div
        onClick={isOpen ? this.onDismiss : this.onShow}
        className={isOpen ? styles.isOpen : styles.isClosed}
      >
        <IconButton iconProps={{ iconName: iconString }} />
      </div>
    );

    let panel: JSX.Element = (
      <Panel
        isBlocking={false}
        isOpen={isOpen}
        onDismiss={this.onDismiss}
        type={PanelType.smallFixedNear}
        className={styles.panel}
        hasCloseButton={false}>
        <ProductSearch />
      </Panel>
    );
    return (
      <div className={styles.wrapper}>
        <div>{panel}</div>
        {icon}
      </div>
    );
  }

  /** Dismiss Panel */
  private onDismiss = (): void => {
    this.setState({ isOpen: false });
  };

  /**
   * Show panel
   */
  private onShow = (): void => {
    this.setState({ isOpen: true });
  };
}

export default SearchPanel;
