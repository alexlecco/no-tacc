import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  getProductPhoto(id) {
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/products%2F${id}.png?alt=media`
  }

  render() {
    const product = this.props.product.item;
    
    return (
      <View style={styles.card}>
        <Image style={styles.photo} source={{uri: this.getProductPhoto(product.id)}} />
        <View style={styles.product}>
          <Text style={styles.name}> {product.name}</Text>
          <Text style={styles.brand}>
            Marca: {product.name}
          </Text>
          <Text style={styles.description}>
            {product.name}:
            Irure nisi duis reprehenderit consectetur.Anim consectetur ipsum qui esse non id pariatur ad quis.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 0.2,
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 10
    
  },
  photo: {
    width: 50,
    height: 'auto',
    flex: 0.3,
    backgroundColor: 'powderblue'
  },
  product: {
    flex: 0.7,
    padding: 5,
    backgroundColor: 'skyblue'
  },
  name: {
    fontSize: 20,
    textAlign: 'center'
  }
});
