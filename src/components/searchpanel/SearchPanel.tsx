import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";

export interface SearchPanelProps {

}

export interface SearchPanelState {
    isOpen: boolean;
}



class SearchPanel extends React.Component<SearchPanelProps, SearchPanelState> {
    constructor(props: SearchPanelProps) {
        super(props);
        this.state = {
            isOpen: true
        };
    }


    public render() {
        const { isOpen } = this.state;
        let panel: JSX.Element = <Panel isBlocking={false} isOpen={isOpen} onDismiss={this.onDismiss} />;
        return (
            { panel }
        );
    }

    private onDismiss = (): void => {
        this.setState({ isOpen: true });
    }

    private onShow = (): void => {
        this.setState({ isOpen: false });
    }
}

export default SearchPanel;