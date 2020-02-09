import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator
} from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getDistance } from 'geolib';

import StoreCard from './StoreCard';
import { firebaseApp } from '../config/firebase';

export default class ProductByStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productByStores: [],
      loading: true,
      location: null,
      errorMessage: null,
      orderedStores: []
    };

    this.productByStoresRef = firebaseApp
      .database()
      .ref()
      .child('products-stores');
  }

  componentWillMount() {
    this.verifyDevice();
    this.listenForproductByStores(this.productByStoresRef);
  }

  verifyDevice() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Esta funcionalidad no está disponible'
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permiso denegado para acceder a la geolocalización'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });
    const { stores } = this.props;

    const localPoint = {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    };

    const updatedList = stores.map(point => {
      return {
        id: point.id,
        address: point.address,
        name: point.name,
        distance: getDistance(localPoint.location, point.location),
        location: {
          latitude: point.location.latitude,
          longitude: point.location.longitude
        },
        _key: point.name
      };
    });

    updatedList.sort((a, b) => (a.distance > b.distance ? 1 : -1));

    this.setState({ orderedStores: updatedList });
  };

  listenForproductByStores(productByStoresRef) {
    const productID = this.props.product.id;

    productByStoresRef.on('value', snap => {
      let productByStores = [];
      snap.forEach(child => {
        if (child.val().product === productID) {
          productByStores.push({
            id: child.val().id,
            price: child.val().price,
            product: child.val().product,
            store: child.val().store,
            _key: child.key
          });
        }
      });

      this.setState({
        productByStores: productByStores,
        loading: false
      });
    });
  }

  reorderProducts() {
    let { orderedStores, productByStores } = this.state;
    let reorderedProducts = [];

    orderedStores.forEach(store => {
      let found = false;

      productByStores.filter(product => {
        if (!found && product.store == store.id) {
          reorderedProducts.push(product);
          found = true;
        } else {
          found = false;
        }
      });
    });

    return reorderedProducts;
  }

  getProductPhoto(id) {
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/products%2F${id}.png?alt=media`;
  }

  setDistanceText() {
    let text = 'Calculando distancia';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return text === 'Calculando distancia' ? text : '';
  }

  render() {
    const { product } = this.props;
    const { orderedStores } = this.state;
    const reorderedProducts = this.reorderProducts();
    const distanceText = this.setDistanceText();

    return this.state.loading ? (
      <View style={styles.loading}>
        <Text style={styles.title}> Cargando </Text>
        <ActivityIndicator />
      </View>
    ) : (
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: this.getProductPhoto(product.id) }}
            style={styles.coverImage}
          />
          <Text style={styles.title}> {product.name} </Text>
            <Text style={styles.title}>{distanceText}</Text>
          <FlatList
            style={styles.flatList}
            data={reorderedProducts}
            renderItem={productByStores => (
              <StoreCard
                productByStores={productByStores}
                product={product}
                orderedStores={orderedStores}
              />
            )}
            keyExtractor={(product, index) => {
              return product.id.toString();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 5
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo: {
    width: 50,
    height: 'auto',
    flex: 0.3,
    backgroundColor: 'powderblue'
  },
  coverImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 4
  }
});
