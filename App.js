import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  YellowBox,
  Platform,
  StatusBar,
  TextInput
} from 'react-native';

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
      searchText: '',
      allProducts: []
    };

    this.productsRef = firebaseApp
      .database()
      .ref()
      .child('products');
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

  listenForProducts(productsRef) {
    productsRef.on('value', snap => {
      let products = [];
      snap.forEach(child => {
        products.push({
          id: child.val().id,
          name: child.val().name,
          brand: child.val().brand,
          quantity: child.val().quantity,
          marsh3Allowed: child.val().marsh3Allowed,
          _key: child.key
        });
      });

      this.setState({
        allProducts: products,
        products: products
      });
    });
  }

  filterSearch(text) {
    let hipoteticUser = { celiaquia3: true };

    let filteredProducts = this.state.allProducts.filter(product => {
      for(product in allProducts){
        if(hipoteticUser.celiaquia3 === product.marsh3Allowed){
          product.name.toLowerCase().includes(text.toLowerCase());
        }
      }
    });

    this.setState({
      products: filteredProducts,
      searchText: text
    });
  }

  render() {
    const { products, product } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.filterSearch(text)}
            value={this.state.searchText}
            placeholder='Buscar producto'
          />
        </View>
        {this.state.ProductByStoresVisible ? (
          <ProductByStores
            product={product}
            showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
          />
        ) : (
          <ProductSearchResults
            products={products}
            showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: colors.black
  },
  textInput: {
    flex: 1,
    borderRadius: 8,
    height: 40,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    margin: 10,
    padding: 10,
    color: colors.primaryTextColor,
    backgroundColor: colors.white
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
