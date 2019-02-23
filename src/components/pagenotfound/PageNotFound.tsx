import React from "react";
import { Image } from "office-ui-fabric-react/lib/Image";
import styles from "./PageNotFound.module.scss";
import { Link } from "office-ui-fabric-react/lib/Link";


export default class PageNotFound extends React.Component {
    private image = require("../../assets/404.png");
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
