import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  Platform,
  Text
} from 'react-native';

import { firebaseApp } from '../config/firebase';
import colors from '../constants/Colors';
import StoreCard from '../components/StoreCard';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default class StoresScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      user: {
        first_name: '',
        last_name: '',
        celiac_status: false,
      },
      selected: 'key0',
      isUser: false,
      location: null,
      orderedStores: []
    };

    this.storesRef = firebaseApp.database().ref().child("stores");
  }

  componentWillMount() {
    this.verifyDevice(this.storesRef);
  }

  verifyDevice(storesRef) {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Esta funcionalidad no está disponible'
      });
    } else {
      this._getLocationAsync(storesRef);
    }
  }

  _getLocationAsync = async (storesRef) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permiso denegado para acceder a la geolocalización'
      });
    }

    let stores = [];
    storesRef.on("value", snap => {
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
          openedTime: child.val().openedTime,
          _key: child.key
        });
      });
    });

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });

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
        openedTime: point.openedTime,
        _key: point.name
      };
    });

    updatedList.sort((a, b) => (a.distance > b.distance ? 1 : -1));

    this.setState({ orderedStores: updatedList });
  };

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
    const { orderedStores } = this.state;
    const distanceText      = this.setDistanceText();

    console.log("orderedStores:::::::::::::::::", orderedStores)

    return (
      <SafeAreaView style={{ flex: 1 }}>
          <React.Fragment>
            <ScrollView>
              <View style={styles.body}>
                <Text style={styles.title}>{distanceText}</Text>
                <FlatList
                    style={styles.flatList}
                    data={orderedStores}
                    renderItem={store => (
                        <StoreCard
                            store={store}
                        />
                    )}
                    keyExtractor={(store, index) => {
                        return store.id.toString();
                    }}
                />
              </View>
            </ScrollView>
          </React.Fragment>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDarkColor,
    height: 200
  },
  load: {
    paddingTop: 320
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 1.5,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
    backgroundColor: 'white'
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  name: {
    fontSize: 28,
    color: colors.primaryTextColor,
    fontWeight: '600'
  },
  info: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginHorizontal: 10,
    marginTop: 20
  },
  description: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginTop: 10,
    textAlign: 'center'
  },
  picker: {
    width: '80%',
    color: colors.primaryTextColor,
    fontSize: 16
    // backgroundColor: colors.secondaryColor,
  },
  button: {
    // position: 'absolute',
    // bottom: 30,
    // right: 15,
    // fontSize: 14,
    // width: '25%',
    // height: '5%',
    // borderRadius: 5,
    // justifyContent: 'center'
  },
  logout: {
    // position: 'absolute',
    // bottom: 30,
    // left: 15,
    // fontSize: 14,
    // width: '25%',
    // height: '5%',
    // borderRadius: 5,
    // justifyContent: 'center'
  },
  pickerContainer: {
    height: 50,
    backgroundColor: 'powderblue',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  panelsContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  panel: {
    justifyContent: 'center',
  },
  pickerContainer: {
    height: 50,
    backgroundColor: 'powderblue',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 200,
    backgroundColor: 'powderblue'
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 5
  }
});