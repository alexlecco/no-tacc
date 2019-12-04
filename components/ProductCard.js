import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("this.props:::::", this.props);
    
    return (
      <View style={styles.card}>
        <View style={styles.product}>
          <Text style={styles.name}> {this.props.number}</Text>
          <Text style={styles.brand}>
            Marca: {this.props.number}
          </Text>
          <Text style={styles.description}>
            {this.props.number}
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
