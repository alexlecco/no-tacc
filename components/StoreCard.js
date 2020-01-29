import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { firebaseApp } from "../config/firebase";

import Colors from '../constants/Colors';


export default class StoreCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      store: {},
    }

    this.storesRef = firebaseApp.database().ref().child("stores");
  }

  componentWillMount() {
    this.listenForStores(this.storesRef);
  }

  listenForStores(storesRef) {
    const productByStores = this.props.productByStores.item;

    storesRef.on("value", snap => {
      let stores = [];
      snap.forEach(child => {
        stores.push({
          id: child.val().id,
          address: child.val().address,
          name: child.val().name,
          distance: child.val().distance,
          location: {
            latitude: child.val().location.latitude,
            longitude: child.val().location.longitude
          },
          _key: child.key
        });
      });

      const store = stores.find(item => item.id === productByStores.store)

      //console.log("stores:::::", stores)

      this.setState({
        stores: stores,
        store: store,
      });
    });
  }

  getStorePhoto(store) {
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/stores%2F${store}.png?alt=media`;
  }

  render() {
    const { orderedStores } = this.props;
    const productByStores = this.props.productByStores.item;
    const store = orderedStores.find(store => store.id === productByStores.store)
    //console.log('store:::::: ', store);
    //console.log('productByStores:::::: ', productByStores);
    
    return (
      <View style={styles.card}>
        <Image style={styles.photo} source={{uri: this.getStorePhoto(productByStores.store)}} />
        <View style={styles.store}>
          <Text style={styles.name}> {store.name} </Text>
          <Text style={styles.address}>
            Dirección: {store.address}
          </Text>
          <Text style={styles.address}>
            Distancia: {store.distance} m
          </Text>
          <Text style={styles.address}>
            Precio: ${ productByStores.price }
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
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryDarkColor,
  },
  photo: {
    borderRadius: 5,
    width: 50,
    height: 'auto',
    flex: 0.3,
  },
  store: {
    flex: 0.7,
    padding: 5,
  },
  name: {
    fontSize: 20,
    textAlign: 'center'
  }
});
