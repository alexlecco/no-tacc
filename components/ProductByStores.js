import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Image, Dimensions } from "react-native";

import { firebaseApp } from "../config/firebase";

export default class ProductByStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productByStores: []
    };

    this.productByStoresRef = firebaseApp
      .database()
      .ref()
      .child("products-stores");
  }

  componentWillMount() {
    this.listenForproductByStores(this.productByStoresRef);
  }

  listenForproductByStores(productByStoresRef) {
    const productID = this.props.product.id;

    productByStoresRef.on("value", snap => {
      let productByStores = [];
      snap.forEach(child => {
        if (`prod${child.val().product}` === productID) {
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

  getProductPhoto(id) {
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/products%2F${id}.png?alt=media`;
  }

  render() {
    const { product } = this.props;
    const { productByStores } = this.state;

    return (
      <View>
        <Image
          source={{ uri: this.getProductPhoto(product.id) }}
          style={styles.coverImage}
        />
        <Text style={styles.title}> Producto: {product.name} </Text>
        {productByStores.map((item, index) => (
          <View key={index}>
            <Text style={styles.title}>Precio: ${item.price}</Text>
          </View>
        ))}
        <Button
          title="volver"
          onPress={() => this.props.showOrHideProducByStores(product)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    title: {
        color: colors.white,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 5,
    },
    photo: {
        width: 50,
        height: "auto",
        flex: 0.3,
        backgroundColor: "powderblue",
    },
    coverImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 4,
    }
});
