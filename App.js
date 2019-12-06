import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, YellowBox, Platform, StatusBar } from 'react-native';
import colors from './constants/Colors';
import ProductSearchResults from './components/ProductSearchResults';
import ProductByStores from './components/ProductByStores';

import { firebaseApp } from './config/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductByStoresVisible: false,
      product: {},
    };

    this.productsRef = firebaseApp.database().ref().child('products');
    showOrHideProducByStores = this.showOrHideProducByStores.bind(this);

    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    YellowBox.ignoreWarnings(['Warning: ...']);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentWillMount() {
    this.listenForProducts(this.productsRef);
  }

  showOrHideProducByStores(product) {
    if(!this.state.ProductByStoresVisible) {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: product.name,
          id: product.id,
      }});
    }
    else {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: '',
          id: product.id,
      }});
    }
  }

  listenForProducts(productsRef) {
    productsRef.on('value', snap => {
      let products = [];
      snap.forEach(child => {
        products.push({
          id: child.val().id,
          name: child.val().name,
          brand: child.val().brand,
          quantity: child.val().quantity,
          _key: child.key
        });
      });

      this.setState({
        products: products
      });
    });
  }

  render() {
    const { products, product } = this.state;
    //console.log("STATE en app::::::::::::", this.state)

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        {
          this.state.ProductByStoresVisible ?
            <ProductByStores
              product={product}
              showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
            />
          :
            <ProductSearchResults 
              products={products}
              showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
            />
        }

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: colors.black,
  },
});
