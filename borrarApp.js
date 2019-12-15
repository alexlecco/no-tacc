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
import { GoogleSignIn } from 'expo-google-sign-in';

initAsync = async () => {
  await GoogleSignIn.initAsync({
    androidClientId: "246004460762-6ac3ug1la8sill81a2j03vkl1oo1rhgu.apps.googleusercontent.com"
  });
  this._syncUserWithStateAsync();
};

_syncUserWithStateAsync = async () => {
  const user = await GoogleSignIn.signInSilentlyAsync();
  this.setState({ user });
};

signOutAsync = async () => {
  await GoogleSignIn.signOutAsync();
  this.setState({ user: null });
};

signInAsync = async () => {
  try {
    await GoogleSignIn.askForPlayServicesAsync();
    const { type, user } = await GoogleSignIn.signInAsync();
    if (type === 'success') {
      this._syncUserWithStateAsync();
    }
  } catch ({ message }) {
    alert('login: Error:' + message);
  }
};

onPress = () => {
  if (this.state.user) {
    this.signOutAsync();
  } else {
    this.signInAsync();
  }
};

const LoginPage = props => {
  return (
    <View style={styles.loading}>
      <Button 
        title="ingresá con Google wachi"
        onPress={onPress()}
      />
    </View>
  )
}

const SettingsPage = props => { 
  //console.log("PROPS:::::::::::", props)
  return (
    <View style={props.styles.settings}>
      <Text>grado de celiaqui Marsh 3</Text>
      <CheckBox
        title='grado de celiaqui Marsh 3'
        checked={props.marsh3Allowed}
        onPress={() => props.changeMarsh3Value()}
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
      ProductByStoresVisible: false,
      SettingsVisible: true,
      product: {},
      searchText: '',
      allProducts: [],
      textInputStatus: 'untouched',
      activeApp: true,
      signedIn: false,
      name: '',
      photoUrl: '',
      marsh3Allowed: true,
      user: null
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
    initAsync();
  }

  async storeUser(user) {
    try {
       await AsyncStorage.setItem("user", JSON.stringify(user));
       await AsyncStorage.setItem("logged", true);
    } catch (error) {
      await AsyncStorage.setItem("logged", false);
      //console.log("Something went wrong", error);
    }
  }

  async getUser() {
    try {
      let user = JSON.parse(await AsyncStorage.getItem("user"));
      let logged = await AsyncStorage.getItem("logged");
      if(logged === true) {
        this.setState({signedIn: true, name: user})
        return true;
      } else {
        this.setState({signedIn: false, name: ""})
        return false;
      }
    } catch (error) {
      //console.log("Something went wrong", error);
    }
  }

  addUser(loggedUser) {
    var ref =  firebaseApp.database().ref();
    var usersRef = ref.child('users');
    usersRef.child(loggedUser.uid).set({
      name: loggedUser.displayName,
      userId: loggedUser.uid,
    }).key;
  }

  showOrHideProductByStores(product) {
    if(!this.state.ProductByStoresVisible) {
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

      // HARDCODED USER..PLEASE DELETE
      let hipoteticUser = { celiaquia3: false };

      // POP PRODUCTS W CELIAC IMCOMPATIBLE WITH THE USER
      for(product in products){
        if(hipoteticUser.celiaquia3 !== product.marsh3Allowed){
          products.pop(product);
        }
      }

      this.setState({
        allProducts: products,
        products: products
      });
    });
  }

  changeMarsh3Value() {
    this.setState({ marsh3Allowed: !this.state.marsh3Allowed })
    //console.log("permitido??????", !this.state.marsh3Allowed)
  }

  listenForActiveApp(activeAppRef) {
    activeAppRef.on('value', snap => {
      let activeApp = snap.val();
      this.setState({ activeApp: activeApp });
    });
  }

  filterSearch(text) {
   
    let filteredProducts = this.state.allProducts.filter(product => 
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

  googleSignIn = async () => {
    try {
      const config = {
        androidClientId: "246004460762-6ac3ug1la8sill81a2j03vkl1oo1rhgu.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      }

      const result = await Google.logInAsync(config)

      if(result.type === 'success') {
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
        this.storeUser({name: result.user.name})

        const credential = firebaseApp.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken
        );
        
        /* credential is and xf {} object */
        firebaseApp.auth().signInWithCredential(credential)
          .then(user => {//console.log( user);})
          .catch(error => {//console.log(error);});
        return result.accessToken;
      } else {
        //console.log("cancelled")
      }
    } catch (e) {
      //console.log("error", e)
    }
  }

  async googleSignOut() {
    await AsyncStorage.setItem("user", {"user": {}, "logged": false});
    this.setState({signedIn: false, name: ''})
  }

  render() {
    const { products, product, signedIn, SettingsVisible } = this.state;
    const logged = signedIn;

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        {
          this.state.activeApp
          ?
            logged
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
                      products={products}
                      showOrHideProductByStores={this.showOrHideProductByStores.bind(this)}
                      googleSignOut={this.googleSignOut.bind(this)}
                      showOrHideSettings={this.showOrHideSettings.bind(this)}
                    />
                  )}
                </React.Fragment>
              
            :
              <LoginPage getUser={this.getUser.bind(this)} />
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
