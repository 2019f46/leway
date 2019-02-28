import * as React from "react";
import { SearchBox } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/FakeSearchService";

export interface IProductSearchProps {
    fakeData?: boolean;
}

export interface IProductSearchState {

}

export default class ProductSearch extends React.Component<IProductSearchProps, IProductSearchState> {
    private searchService: ISearchService;
    constructor(props: any) {
        super(props);
        this.state = {};
        this.searchService = this.props.fakeData ? new FakeSearchService() : new SearchService();
    }
    public render(): JSX.Element {
        return (
            <div className={styles.productSearchContainer}>
                <SearchBox
                    placeholder="Search"
                    onChange={value => this.onProductSearch(value)} />
            </div>
        );
    }

    private onProductSearch = async (value: string) => {
        // make this function do a delay before executing next function
        this.executeProductSearch(value);
    }

    private executeProductSearch = async (value: string) => {
        let results = await this.searchService.getProduct(value);
    }
}
