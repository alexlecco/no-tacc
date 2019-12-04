import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import ProductCard from './components/ProductCard';

import { firebaseApp } from './config/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };

    this.productsRef = firebaseApp
      .database()
      .ref()
      .child('products');
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
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'white' }}>3 productos encontrados</Text>
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
  flatList:{
    flex: .5
  }
});
