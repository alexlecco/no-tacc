import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Image, Dimensions, FlatList, } from "react-native";

import StoreCard from './StoreCard';
import { firebaseApp } from "../config/firebase";

import {Footer, Spinner} from 'native-base';
import { getDistance } from 'geolib';

export default class ProductByStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productByStores: [],
      loading: true,
      mainPoint: {latitude: -26.8283728, longitude: -65.2224645},
      orderedStores: []
    };

    this.productByStoresRef = firebaseApp.database().ref().child("products-stores");
  }

  componentWillMount() {
    this.listenForproductByStores(this.productByStoresRef);
    this.calculate()
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
        productByStores: productByStores,
        loading: false
      });
    });
  }

  calculate() {
    const { mainPoint } = this.state;
    const { stores } = this.props;

    const updatedList = stores.map((point) => {
      return({
        id: point.id,
        address: point.address,
        name: point.name,
        distance: getDistance(mainPoint, point.location),
        location: {
          latitude: point.location.latitude,
          longitude: point.location.longitude
        },
        _key: point.name
      })
    });
    
    updatedList.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
        
    this.setState({ orderedStores: updatedList });
  }

  reorderProducts() {
    let { orderedStores, productByStores } = this.state;
    let reorderedProducts = []

    orderedStores.forEach(store => {
      let found = false;
      
      productByStores.filter(product => {
        if(!found && product.store == store.id) {
          reorderedProducts.push(product)
          found = true
        } else {
          found = false
        }
      })
    });

    return reorderedProducts;
  }

  getProductPhoto(id) {
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/products%2F${id}.png?alt=media`;
  }

  render() {
    const { product } = this.props;
    const { productByStores, orderedStores } = this.state;
    const reorderedProducts = this.reorderProducts();

    return (
      this.state.loading ?
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
                data={reorderedProducts}
                renderItem={productByStores =>
                              <StoreCard
                                productByStores={productByStores}
                                product={product}
                                orderedStores={orderedStores}
                              />
                            }
                keyExtractor={(product, index) => { return product.id.toString() }}
            />
          <Button
            title="volver"
            onPress={() => this.props.showOrHideProductByStores(product)}
          />
          </View>
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
