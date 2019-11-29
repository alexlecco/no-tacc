import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ProductCard from './components/ProductCard'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ProductCard number={1} />
        <ProductCard number={2} />
        <ProductCard number={3} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
