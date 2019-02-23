import React from "react";
import { Image } from "office-ui-fabric-react/lib/Image";
import styles from "./PageNotFound.module.scss";
import { Link } from "office-ui-fabric-react/lib/Link";


export default class PageNotFound extends React.Component {
    private image = require("../../assets/404.png");
    public render() {
        return (
            <div className={styles.notFoundContainer}>
                <Image src={this.image} />
                <Link href={window.location.origin} />
            </div>
        );
    }
}
