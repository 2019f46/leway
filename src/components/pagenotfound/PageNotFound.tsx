import React from "react";
import { Image } from "office-ui-fabric-react/";
import styles from "./PageNotFound.module.scss";
import { Link } from "office-ui-fabric-react/";

/**
 * This Component is rendered when a URL is not found. The component is responsible for informing the end user that the page was not found and contains instructions as how to go back to a valid page.
 */
export default class PageNotFound extends React.Component {
    private image = require("../../assets/404.png");

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render() {
        return (
            <div className={styles.notFoundContainer}>
                <div>
                    <h1>404 - Oh-oh... Can't find the requested page</h1>
                    <Image src={this.image} />
                    <Link href={window.location.origin}>Return to Homepage</Link>
                </div>
            </div>
        );
    }
}
