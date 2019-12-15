import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  YellowBox,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  AsyncStorage,
  CheckBox
} from 'react-native';

import colors from './constants/Colors';
import ProductSearchResults from './components/ProductSearchResults';
import ProductByStores from './components/ProductByStores';

import { firebaseApp } from './config/firebase';
import * as Google from 'expo-google-app-auth';

const LoginPage = props => {
  return (
    <View style={styles.loading}>
      {
        !props.getUser()
        ?
          <View />
        :
          <Button title="ingresá con Google"
          onPress={() => props.googleSignIn()} />
      }
    </View>
  )
}

const SettingsPage = props => { 
  //console.log("PROPS:::::::::::", props)
  return (
    <View style={props.styles.settings}>
      <Text>¿Tenés grado de celiaqui Marsh 3?</Text>
      <CheckBox
        value={props.marsh3Allowed ? true : false}
        onChange={() => props.changeMarsh3Value()}
      />
      <Button title="Guardar" style={{marginTop: 20, backgroundColor: 'blue'}} onPress={() => props.showOrHideSettings()} />
    </View>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      notAllowedProducts: [],
      ProductByStoresVisible: false,
      SettingsVisible: false,
      product: {},
      searchText: '',
      textInputStatus: 'untouched',
      activeApp: true,
      signedIn: false,
      name: '',
      photoUrl: '',
      marsh3Allowed: false,
    };

    this.productsRef = firebaseApp.database().ref().child('products');
    this.activeAppRef = firebaseApp.database().ref().child('activeApp');
    this.usersRef = firebaseApp.database().ref().child('users');
    
    showOrHideProductByStores = this.showOrHideProductByStores.bind(this);
    showOrHideSettings = this.showOrHideSettings.bind(this);
    googleSignOut = this.googleSignOut.bind(this);
    clearText = this.clearText.bind(this);
    googleSignIn = this.googleSignIn.bind(this);
    getUser = this.getUser.bind(this);
    changeMarsh3Value = this.changeMarsh3Value.bind(this);

    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    YellowBox.ignoreWarnings(['Warning: ...']);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentWillMount() {
    this.listenForProducts(this.productsRef);
    this.listenForActiveApp(this.activeAppRef);
    this.getUser();
  }

  async storeUser(user) {
    try {
       await AsyncStorage.setItem("user", JSON.stringify(user));
       
    } catch (error) {
      //console.log("Something went wrong", error);
    }
  }

  async getUser() {
    try {
      let userData = await AsyncStorage.getItem("user");
      let data = JSON.parse(userData);
      if(data !== null) {
        this.setState({signedIn: true, name: data.name})
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log("Something went wrong", error);
    }
  }

  showOrHideProductByStores(product) {
    if (!this.state.ProductByStoresVisible) {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: product.name,
          id: product.id
        }
      });
    } else {
      this.setState({
        ProductByStoresVisible: !this.state.ProductByStoresVisible,
        product: {
          name: '',
          id: product.id
        }
      });
    }
  }

  showOrHideSettings() {
    this.setState({SettingsVisible: !this.state.SettingsVisible})
  }

  listenForProducts(productsRef) {
    productsRef.on('value', snap => {
      let products = [];
      snap.forEach(child => {
        products.push({
          id: child.val().id,
          name: child.val().name,
          brand: child.val().brand,
          quantity: child.val().quantity,
          marsh3Allowed: child.val().marsh3Allowed,
          _key: child.key
        });
      });

      const notAllowedProducts = products.filter(product => product.marsh3Allowed)
      
      this.setState({
        notAllowedProducts: notAllowedProducts,
        products: products
      });
    });
  }

  changeMarsh3Value() {
    this.setState({ marsh3Allowed: !this.state.marsh3Allowed })
  }

  listenForActiveApp(activeAppRef) {
    activeAppRef.on('value', snap => {
      let activeApp = snap.val();
      this.setState({ activeApp: activeApp });
    });
  }

  filterSearch(text) {
   
    let filteredProducts = this.state.products.filter(product => 
      product.name.toLowerCase().includes(text.toLowerCase())
    );

    this.setState({
      products: filteredProducts,
      searchText: text,
      textInputStatus: 'touched'
    });
  }

  clearText() {
    this.setState({
      textInputStatus: 'untouched',
      searchText: ''
    });

    this.restartSearch()
  }

  restartSearch() {
    this.listenForProducts(this.productsRef);
    this.setState({ProductByStoresVisible: false})
  }

  renderClearButton() {
    if (this.state.textInputStatus == 'touched') {
      return (
        <TouchableOpacity onPress={() => this.clearText()}>
          <Image
            style={styles.button}
            source={require('./assets/img/clear-input.png')}
          />
        </TouchableOpacity>
      );
    } else {
      return <View/ >;
    }
  }

  async googleSignIn() {
    try {
      const result = await Google.logInAsync({
        androidClientId: "246004460762-6ac3ug1la8sill81a2j03vkl1oo1rhgu.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
        this.storeUser({name: result.user.name})
      } else {
        //console.log("cancelled")
      }

    } catch (e) {
      //console.log("error", e)
    }
  }

  async googleSignOut() {
    AsyncStorage.clear();
    this.setState({signedIn: false, name: ''})
  }

  render() {
    const { products, notAllowedProducts, product, signedIn, SettingsVisible } = this.state;
    //console.log("state::::::", this.state)

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        {
          this.state.activeApp
          ?
            signedIn
            ?
              SettingsVisible
              ?
                <SettingsPage
                  styles={styles}
                  changeMarsh3Value={this.changeMarsh3Value.bind(this)}
                  showOrHideSettings={this.showOrHideSettings.bind(this)}
                  marsh3Allowed={this.state.marsh3Allowed}
                />
              :
                <React.Fragment>
                  <View style={styles.searchSection}>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={text => this.filterSearch(text)}
                      value={this.state.searchText}
                      placeholder='Buscar producto'
                    />
                    {this.renderClearButton()}
                  </View>

                  {this.state.ProductByStoresVisible ? (
                    <ProductByStores
                      product={product}
                      showOrHideProductByStores={this.showOrHideProductByStores.bind(this)}
                    />
                  ) : (
                    <ProductSearchResults
                      userName={this.state.name}
                      products={this.state.marsh3Allowed ? notAllowedProducts : products}
                      showOrHideProductByStores={this.showOrHideProductByStores.bind(this)}
                      googleSignOut={this.googleSignOut.bind(this)}
                      showOrHideSettings={this.showOrHideSettings.bind(this)}
                    />
                  )}
                </React.Fragment>
            :
              <LoginPage getUser={this.getUser.bind(this)} googleSignIn={this.googleSignIn.bind(this)} />
          :
            <View style={styles.activeApp}><Text style={styles.title}>Aplicación no activa</Text></View>
        }
              
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: colors.black
  },
  textInput: {
    flex: 1,
    borderRadius: 8,
    height: 40,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    margin: 10,
    padding: 10,
    color: colors.primaryTextColor,
    backgroundColor: colors.white
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: 15,
    width: 15,
    marginRight: 20,
    marginLeft: 5
  },
  activeApp: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
      color: colors.white,
  },
  header: {
    fontSize: 25
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40
  },
  settings: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  }
});
