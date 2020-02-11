import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Switch
} from 'react-native';

import { firebaseApp } from '../config/firebase';
import colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

import firebase from 'firebase';
import Colors from '../constants/Colors';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        celiac_status: false,
      },
      selected: 'key0',
      isUser: false
    };
    const { navigation } = this.props;
    uid = navigation.getParam('uid');
    this.userRef = firebaseApp.database().ref('users/' + uid);
  }

  async getUserData() {
    await this.userRef.once('value', snap => {
      this.setState({
        user: {
          uid: snap.key,
          celiac_status: snap.val().celiac_status,
          first_name: snap.val().first_name,
          last_name: snap.val().last_name,
          profile_picture: snap.val().profile_picture
        },
        preferences: {
          products: {
            prod01: snap.val().preferences.products.prod01,
            prod02: snap.val().preferences.products.prod02,
            prod03: snap.val().preferences.products.prod03,
          },
          dishes: {
            dish01: snap.val().preferences.dishes.dish01,
            dish02: snap.val().preferences.dishes.dish02,
            dish03: snap.val().preferences.dishes.dish03,
          }
        },
        isUser: true
      });

      this.state.user.celiac_status
        ? this.onValueChange('key1')
        : this.onValueChange('key0');
    });
  }

  setUserData() {
    
  }

  componentDidMount() {
    // setTimeout(()=>this.getUserData(), 2000);
    this.getUserData();
  }

  componentWillReceiveProps() {
    this.getUserData();
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
    switch (value) {
      case 'key0':
        this.state.user.celiac_status = false;
        break;
      case 'key1':
        this.state.user.celiac_status = true;
        break;
    }
  }

  next() {
    this.onValueChange(this.state.selected);
    this.userRef.update({
      celiac_status: this.state.user.celiac_status,
      preferences: {
        products: {
          prod01: this.state.preferences.products.prod01,
          prod02: this.state.preferences.products.prod02,
          prod03: this.state.preferences.products.prod03,
        },
        dishes: {
          dish01: this.state.preferences.dishes.dish01,
          dish02: this.state.preferences.dishes.dish02,
          dish03: this.state.preferences.dishes.dish03,
        }
      }
    });
    this.props.navigation.navigate('SearchScreen', {
      uid: this.state.user.uid
    });
  }

  _handleToggleProd01() { this.setState({preferences: { products: { prod01: !this.state.preferences.products.prod01, prod02: this.state.preferences.products.prod02, prod03: this.state.preferences.products.prod03}, dishes: { dish01: this.state.preferences.dishes.dish01, dish02: this.state.preferences.dishes.dish02, dish03: this.state.preferences.dishes.dish03}}})}

  _handleToggleProd02() { this.setState({preferences: { products: { prod01: this.state.preferences.products.prod01, prod02: !this.state.preferences.products.prod02, prod03: this.state.preferences.products.prod03}, dishes: { dish01: this.state.preferences.dishes.dish01, dish02: this.state.preferences.dishes.dish02, dish03: this.state.preferences.dishes.dish03}}})}
  
  _handleToggleProd03() { this.setState({preferences: { products: { prod01: this.state.preferences.products.prod01, prod02: this.state.preferences.products.prod02, prod03: !this.state.preferences.products.prod03}, dishes: { dish01: this.state.preferences.dishes.dish01, dish02: this.state.preferences.dishes.dish02, dish03: this.state.preferences.dishes.dish03}}})}

  _handleToggleDish01() { this.setState({preferences: { products: { prod01: this.state.preferences.products.prod01, prod02: this.state.preferences.products.prod02, prod03: this.state.preferences.products.prod03}, dishes: { dish01: !this.state.preferences.dishes.dish01, dish02: this.state.preferences.dishes.dish02, dish03: this.state.preferences.dishes.dish03}}})}

  _handleToggleDish02() { this.setState({preferences: { products: { prod01: this.state.preferences.products.prod01, prod02: this.state.preferences.products.prod02, prod03: this.state.preferences.products.prod03}, dishes: { dish01: this.state.preferences.dishes.dish01, dish02: !this.state.preferences.dishes.dish02, dish03: this.state.preferences.dishes.dish03}}})}
  
  _handleToggleDish03() { this.setState({preferences: { products: { prod01: this.state.preferences.products.prod01, prod02: this.state.preferences.products.prod02, prod03: this.state.preferences.products.prod03}, dishes: { dish01: this.state.preferences.dishes.dish01, dish02: this.state.preferences.dishes.dish02, dish03: !this.state.preferences.dishes.dish03}}})}
  logout() {
    firebase.auth().signOut();
    this.props.navigation.navigate('LoadingScreen');
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.isUser ? (
          <React.Fragment>
            <View style={styles.header}></View>
            <Image
              style={styles.avatar}
              source={{ uri: this.state.user.profile_picture }}
            />
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>
                  {this.state.user.last_name +
                    ', ' +
                    this.state.user.first_name}
                </Text>

                <Text style={styles.info}>Grado de Celiaquia: </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    note
                    mode='dropdown'
                    style={styles.picker}
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label='Grado 1: Leve/Moderado' value='key0' />
                    <Picker.Item label='Grado 2: Grave' value='key1' />
                  </Picker>
                </View>
                
                <Text style={styles.info}>Gustos y preferencias: </Text>
                  <View style={styles.panelsContainer}>
                    <View style={styles.panel}>

                      <Text>bebidas con alcohol</Text>
                      <Switch
                        onValueChange={() => this._handleToggleProd01()}
                        value={this.state.preferences.products.prod01}
                        trackColor={{true: colors.secondaryDarkColor, false: 'grey'}}
                      />
                      
                      <Text>panificados dulces</Text>
                      <Switch
                        onValueChange={() => this._handleToggleProd02()}
                        value={this.state.preferences.products.prod02}
                        trackColor={{true: colors.secondaryDarkColor, false: 'grey'}}
                      />
                      
                      <Text>chocolates sin azucar</Text>
                      <Switch
                        onValueChange={() => this._handleToggleProd03()}
                        value={this.state.preferences.products.prod03}
                        trackColor={{true: colors.secondaryDarkColor, false: 'grey'}}
                      />
                    </View>
                    <View style={styles.panel}>

                      <Text>pizzas</Text>
                      <Switch
                        onValueChange={() => this._handleToggleDish01()}
                        value={this.state.preferences.dishes.dish01}
                        trackColor={{true: colors.secondaryLightColor, false: 'grey'}}
                      />
                      
                      <Text>pescado</Text>
                      <Switch
                        onValueChange={() => this._handleToggleDish02()}
                        value={this.state.preferences.dishes.dish02}
                        trackColor={{true: colors.secondaryLightColor, false: 'grey'}}
                      />
                      
                      <Text>milanesas</Text>
                      <Switch
                        onValueChange={() => this._handleToggleDish03()}
                        value={this.state.preferences.dishes.dish03}
                        trackColor={{true: colors.secondaryLightColor, false: 'grey'}}
                      />            
                    </View>
                  </View>

              </View>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => this.next()}
              >
                <Text>Guardar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.logout}>
              <TouchableOpacity onPress={() => this.logout()}>
                <Text style={{ textAlign: 'center' }}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        ) : (
          <ActivityIndicator style={styles.load} size="large" />
        )}
      </SafeAreaView>
    );
  }
}
export default ProfileScreen;

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
    position: 'absolute',
    right: 10,
    bottom: 30,
    right: 15,
    fontSize: 14,
    width: '25%',
    height: '5%',
    borderRadius: 5,
    justifyContent: 'center',
  },
  logout: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    fontSize: 14,
    width: '25%',
    height: '5%',
    borderRadius: 5,
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
