import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { firebaseApp } from '../config/firebase';

export default class ProductByStores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productByStores: []
        }

    this.productByStoresRef = firebaseApp.database().ref().child('products-stores');
    }

    componentWillMount() {
        this.listenForproductByStores(this.productByStoresRef);
    }

    listenForproductByStores(productByStoresRef) {
        const productID = this.props.product.id;

        productByStoresRef.on('value', snap => {
            let productByStores = [];
            snap.forEach(child => {
                if(`prod${child.val().product}` === productID) {
                    productByStores.push({
                    id: child.val().id,
                    price: child.val().price,
                    product: child.val().product,
                    store: child.val().store,
                    _key: child.key
                    });
                }
            });

            this.setState({
                productByStores: productByStores
            });
        });
    }

    render() {
        const { product} = this.props;
        const { productByStores } = this.state;

        return (
        <View>
            <Button title="volver" onPress={() => this.props.showOrHideProducByStores(product)} />
            <Text style={styles.title}> Producto: {product.name} </Text>
            {
                productByStores.map(item =>
                    <View>
                        <Text style={styles.title}>Precio: ${item.price}</Text>
                    </View>
                )
            }
        </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: colors.white,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 5
    }
});