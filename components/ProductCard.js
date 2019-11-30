import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // var l = {uri:this.props.url};
    return (
      <View style={styles.card}>
        <Image style={styles.photo} source={require('../assets/img/img1.png')} />
        <View style={styles.product}>
          <Text style={styles.name}> Nombre Producto {this.props.number}</Text>
          <Text style={styles.brand}>
            Marca: {this.props.number} 
          </Text>
          <Text style={styles.description}>
            Nostrud veniam elit quis ad tempor fugiat velit ipsum cupidatat
            voluptate est mollit tempor dolore.
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
