import * as React from "react";
import { Panel, PanelType, Icon, IconButton } from "office-ui-fabric-react";
import styles from "./SearchPanel.module.scss";
import ProductSearch from "../productsearch/ProductSearch";

export interface SearchPanelProps {}

export interface SearchPanelState {
  isOpen: boolean;
}

class SearchPanel extends React.Component<SearchPanelProps, SearchPanelState> {
  constructor(props: SearchPanelProps) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  public render() {
    const { isOpen } = this.state;
    let iconString = isOpen ? "Back" : "Search";

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
        hasCloseButton={false}
      >
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

  private onDismiss = (): void => {
    this.setState({ isOpen: false });
  };

  private onShow = (): void => {
    this.setState({ isOpen: true });
  };
}

export default SearchPanel;
