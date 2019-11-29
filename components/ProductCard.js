import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.photo}>foto</Text>
        <Text style={styles.name}>producto {this.props.number}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  photo: {
    backgroundColor: 'powderblue',
    padding: 10
  },
  name: {
    backgroundColor: 'skyblue',
    padding: 10
  }
});
