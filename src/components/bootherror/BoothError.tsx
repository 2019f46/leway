import { DefaultButton, Dialog, DialogFooter, PrimaryButton } from "office-ui-fabric-react";
import React from "react";
import styles from "./BoothError.module.scss";
/**
 * Properties recived by the BoothError Component.
 * @param acknowledge Optional prop, prop which the parent uses to ackowledge no location.
 */
export interface BoothErrorProps {
    acknowledge: () => void;
}

/**
 * This Component is rendered when there is no booth setup, and is responsible for guiding the user on what to do.
 */
export default class BoothError extends React.Component<BoothErrorProps, {}>{
    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let dialog: JSX.Element = (
            <Dialog hidden={false} onDismiss={this.acknowledge} modalProps={{ isDarkOverlay: true }} className={styles.dialogContainer}>
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
        this.props.acknowledge();
    }

    /**
     * Redirect the url to the settings page
     */
    private goToSettings = () => {
        window.location.href = "settings";
    }
}
