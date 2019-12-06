import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, YellowBox, Platform, StatusBar } from 'react-native';
import ProductSearchResults from './components/ProductSearchResults';
import colors from './constants/Colors';

import { firebaseApp } from './config/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };

    this.productsRef = firebaseApp.database().ref().child('products');

    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    YellowBox.ignoreWarnings(['Warning: ...']);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentWillMount() {
    this.listenForProducts(this.productsRef);
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
    const { products } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        <ProductSearchResults products={products} />

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
