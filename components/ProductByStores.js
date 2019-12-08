import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Image, Dimensions, FlatList, } from "react-native";

import StoreCard from './StoreCard';
import { firebaseApp } from "../config/firebase";

export default class ProductByStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productByStores: [],
    };

    this.productByStoresRef = firebaseApp.database().ref().child("products-stores");
  }

  componentWillMount() {
    this.listenForproductByStores(this.productByStoresRef);
  }

  listenForproductByStores(productByStoresRef) {
    const productID = this.props.product.id;

    productByStoresRef.on("value", snap => {
      let productByStores = [];
      snap.forEach(child => {
        if (child.val().product === productID) {
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
    const { productByStores, stores } = this.state;

    return (
      productByStores.length === 0 ?
        <View style={styles.loading}><Text style={styles.title}> Cargando </Text></View>
      :
        <View style={styles.container}>
          <View>
            <Image
              source={{ uri: this.getProductPhoto(product.id) }}
              style={styles.coverImage}
            />
            <Text style={styles.title}> {product.name} </Text>
            <FlatList
                style={styles.flatList}
                data={productByStores}
                renderItem={productByStores => <StoreCard productByStores={productByStores} product={product} />}
                keyExtractor={(product, index) => { return product.id.toString() }}
            />
          </View>
          <Button
            title="volver"
            onPress={() => this.props.showOrHideProducByStores(product)}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    title: {
        color: colors.white,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 5,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
