import React from "react";
import { Dialog, DialogFooter, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import styles from "./BoothError.module.scss";
/**
 * Properties recived by the BoothError Component.
 * @param acknowledge Optional prop, prop which the parent uses to ackowledge no location.
 */
export interface BoothErrorProps {
    acknowledge: (state: boolean) => void;
}

export interface BoothErrorState {
}

/**
 * This Component is rendered when there is no booth setup, and is responsible for guiding the user on what to do.
 */
export default class BoothError extends React.Component<BoothErrorProps, BoothErrorState>{
    constructor(props: any) {
        super(props);
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let dialog: JSX.Element = (
            <Dialog hidden={false} modalProps={{ isDarkOverlay: true }} className={styles.dialogContainer}>
                <h3>Booth is not configured.</h3>
                <DialogFooter>
                    <DefaultButton text={"Booth Settings"} onClick={this.goToSettings} />
                    <PrimaryButton text={"OK"} onClick={this.acknowledge} />
                </DialogFooter>
            </Dialog>
        );
        return (
            dialog
        );
    }

    /**
     * Method used for acknowledging that there are no map settings available, which results in no wayfinding.
     */
    private acknowledge = () => {
        this.props.acknowledge(true);
    }

    /**
     * Redirect the url to the settings page
     */
    private goToSettings = () => {
        window.location.href = "settings";
    }
}
