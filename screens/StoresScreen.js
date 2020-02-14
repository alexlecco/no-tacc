import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Switch,
  FlatList,
  ScrollView
} from 'react-native';

import { firebaseApp } from '../config/firebase';
import colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StoreCard from '../components/StoreCard';

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
      isUser: false
    };

    this.storesRef = firebaseApp.database().ref().child("stores");
  }

  componentWillMount() {
    this.listenForStores(this.storesRef);
  }

  listenForStores(storesRef) {
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

      this.setState({ stores: stores });
    });
    }

  render() {
    const { stores } = this.state;
    console.log("stores:::::::::::", stores)

    return (
      <SafeAreaView style={{ flex: 1 }}>
          <React.Fragment>
            <ScrollView>
              <View style={styles.body}>
                <FlatList
                    style={styles.flatList}
                    data={stores}
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
  }
});