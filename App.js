import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, YellowBox, Platform, StatusBar } from 'react-native';
import ProductCard from './components/ProductCard';
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
        
        <Text style={styles.title}> { products.length } productos encontrados </Text>
        <FlatList
          style={styles.flatList}
          data={this.state.products}
          renderItem={product => <ProductCard product={product} />}
          keyExtractor={(product, index) => {
            return product.id.toString();
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  flatList:{
    flex: .5
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: colors.black,
  },
});
