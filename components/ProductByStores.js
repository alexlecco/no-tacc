import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ProductByStores extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View><Text style={styles.title}> Producto: {this.props.product.name} </Text></View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
      color: colors.white,
      textAlign: 'center',
      paddingTop: 20,
      paddingBottom: 5
    }
});