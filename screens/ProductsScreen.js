import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import ProductSearchResults from '../components/ProductSearchResults';
import ProductByStores from '../components/ProductByStores';

import { firebaseApp } from "../config/firebase";

export default class ProductsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      stores: [],
      product: {},
      ProductByStoresVisible: false
    };

    showOrHideProductByStores = this.showOrHideProductByStores.bind(this);
    this.storesRef = firebaseApp.database().ref().child("stores");
  }

  componentWillMount() {
    this.cloneData(this.storesRef)
  }

  cloneData(storesRef) {
    storesRef.on("value", snap => {
      let stores = [];
      snap.forEach(child => {
        stores.push({
          id: child.val().id,
          address: child.val().address,
          name: child.val().name,
          distance: child.val().distance,
          location: {
            latitude: child.val().location.latitude,
            longitude: child.val().location.longitude
          },
          openedTime: child.val().openedTime,
          _key: child.key
        });
      });

      this.setState({ stores: stores });
    });
  }

  getProducts() {
    const { navigation } = this.props;
    const products = navigation.getParam('products');
    this.state.products = products;
    return this.state.products;
  }

  showOrHideProductByStores(product) {
    if (!this.state.ProductByStoresVisible) {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: product.name,
          id: product.id
        }
      });
    } else {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: '',
          id: product.id
        }
      });
    }
  }

  render() {
    const {product, stores} = this.state;
    return (
      <View style={styles.container}>
        {this.state.ProductByStoresVisible ? (
          <ProductByStores
            product={product}
            stores={stores}
            showOrHideProductByStores={this.showOrHideProductByStores.bind(this)}
          />
        ) : (
          <ProductSearchResults
            products={this.getProducts()}
            showOrHideProductByStores={this.showOrHideProductByStores.bind(
              this
            )}
          />
        )}
        {/* <Button title="volver" onPress={() => this.props.navigation.navigate('SearchScreen')} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
