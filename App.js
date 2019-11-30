import React, { Component } from 'react';
import { StyleSheet, Text,  View } from 'react-native';
import ProductCard from './components/ProductCard'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
      <Text style={{color: 'white'}}>3 productos encontrados</Text>
        <ProductCard number={1} url={'./assets/img/img1.png'}/>
        <ProductCard number={2} url={'./assets/img/img2.png'}/>
        <ProductCard number={3} url={'./assets/img/img3.png'}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
