import Axios from "axios";
import { Checkbox, DetailsList, IColumn, Image } from "office-ui-fabric-react";
import React from "react";
import { IProduct } from "../../models/ProductModel";
import styles from "./MagnetizedProducts.module.scss";

export interface MagnetizedProductsProps {
    products: IProduct[];
    fakeData?: boolean;
}

export interface MagnetizedProductsState {
    columns: IColumn[] | undefined;
    allProducts: IProduct[];
    magnetizedProducts: { ProductId: string, guid: string, Name: string, isMagnetized: string }[];
}

class MagnetizedProducts extends React.Component<MagnetizedProductsProps, MagnetizedProductsState> {
    constructor(props: MagnetizedProductsProps) {
        super(props);
        this.state = { columns: undefined, allProducts: this.props.products, magnetizedProducts: [] };
    }
    public render() {
        return (
            <DetailsList
                className={styles.magnetizedProductsContainer}
                columns={this.state.columns}
                items={this.state.allProducts}
            />
        );
    }

    public async componentDidMount() {
        this.setListColumns();
        await this.fetchProduct();
    }

    private fetchProduct = async () => {
        let result = await Axios.get("https://magnetizer20190429034033.azurewebsites.net/api/products");
        let magnets: [{ ProductId: string, guid: string, Name: string, isMagnetized: string }] = await result.data;

        magnets.forEach(element => {
            this.addIfNotExist(element);
        });

        this.setState({ magnetizedProducts: magnets });
    }

    private addIfNotExist = async (item: { ProductId: string, guid: string, Name: string, isMagnetized: string }) => {
        if (item && this.state.magnetizedProducts && this.state.allProducts.length > 0) {
            let contains = this.state.magnetizedProducts.filter(product => {
                if (product.guid === item.guid) {
                    return product;
                }
            });

            console.log(contains);

            // if (!contains || contains.length === 0) {
            //     await Axios.post("https://magnetizer20190429034033.azurewebsites.net/api/products", { Guid: item.id, Name: item.name, IsMagnetized: false });
            // }
        }

    }

    private setListColumns = () => {
        const columns: IColumn[] = [
            {
                key: "name",
                name: "Name",
                fieldName: "name",
                minWidth: 50,
                maxWidth: 300,
            },
            {
                key: "magnetized",
                name: "Magnetized",
                fieldName: "magnetized",
                minWidth: 30,
                maxWidth: 120,
                onRender: (item: IProduct) => {
                    return <Checkbox defaultChecked={false} style={{ paddingTop: "5px" }} />;

                }
            },
            {
                key: "image",
                name: "Image",
                fieldName: "image",
                minWidth: 30,
                maxWidth: 100,
                onRender: (item: IProduct) => {
                    return <Image src={item.image} height={50} width={50} />;
                }
            },
            {
                key: "quantity",
                name: "Remaining",
                fieldName: "quantity",
                minWidth: 30,
                maxWidth: 100,
            },
            {
                key: "location",
                name: "Location",
                fieldName: "location",
                minWidth: 30,
                maxWidth: 100,
                onRender: (item: IProduct) => {
                    if (item && item.location) {
                        return <span>{`${item.location.x}, ${item.location.y}`}</span >;
                    } else {
                        return <span>Location has not been set</span>;
                    }
                }
            }
        ];
        this.setState({ columns: columns });
    }
}


export default MagnetizedProducts;
