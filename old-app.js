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
  AsyncStorage
} from 'react-native';

import colors from './constants/Colors';
import ProductSearchResults from './components/ProductSearchResults';
import ProductByStores from './components/ProductByStores';

import { firebaseApp } from './config/firebase';
import * as Google from 'expo-google-app-auth';

const LoginPage = props => {
  return (
    <View style={styles.loading}>
      {!props.getUser() ? (
        <View />
      ) : (
        <Button
          title='ingresá con Google'
          onPress={() => props.googleSignIn()}
        />
      )}
    </View>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductByStoresVisible: false,
      product: {},
      searchText: '',
      allProducts: [],
      textInputStatus: 'untouched',
      activeApp: true,
      signedIn: false,
      name: '',
      photoUrl: ''
    };

    this.productsRef = firebaseApp
      .database()
      .ref()
      .child('products');
    this.activeAppRef = firebaseApp
      .database()
      .ref()
      .child('activeApp');
    this.usersRef = firebaseApp
      .database()
      .ref()
      .child('users');

    showOrHideProductByStores = this.showOrHideProductByStores.bind(this);
    googleSignOut = this.googleSignOut.bind(this);
    clearText = this.clearText.bind(this);
    googleSignIn = this.googleSignIn.bind(this);
    getUser = this.getUser.bind(this);

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
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }

  async getUser() {
    try {
      let userData = await AsyncStorage.getItem('user');
      let data = JSON.parse(userData);
      if (data !== null) {
        this.setState({ signedIn: true, name: data.name });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Something went wrong', error);
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
      let hipoteticUser = { celiaquia3: true };

      // POP PRODUCTS W CELIAC IMCOMPATIBLE WITH THE USER
      for (product in products) {
        if (hipoteticUser.celiaquia3 != product.marsh3Allowed) {
          products.pop(product);
        }
      }

      this.setState({
        allProducts: products,
        products: products
      });
    });
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

    this.restartSearch();
  }

  restartSearch() {
    this.listenForProducts(this.productsRef);
    this.setState({ ProductByStoresVisible: false });
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
      return <View />;
    }
  }

  //SIGN IN FLOW f/ FIREBASE
  onSignIn = googleUser => {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebaseApp.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebaseApp.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebaseApp
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              if (result.additionalUserInfo.isNewUser) {
                // console.log('result:', result);
                // console.log(JSON.stringify(result));
                // console.log('Google sign in');
                firebaseApp
                  .database()
                  .ref('users/' + result.user.uid)
                  .set({
                    mail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    celiaquia3: false //MARSH 3 CELIAC LEVEL FALSE FOR DEFAULT
                  })
                  .then(function(snapshot) {
                    // console.log('Snapshot: ',snapshot);
                  });
              } else {
                firebaseApp
                  .database()
                  .ref('users/' + result.user.uid)
                  .update({
                    //UPDATE DATA
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log('Google Error', errorMessage);
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  async googleSignIn() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          '246004460762-6ac3ug1la8sill81a2j03vkl1oo1rhgu.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        });
        this.storeUser({ name: result.user.name });
      } else {
        console.log('cancelled');
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  async googleSignOut() {
    AsyncStorage.clear();
    this.setState({ signedIn: false, name: '' });
  }

  render() {
    const { products, product, signedIn } = this.state;
    // console.log("state::::::", this.state)

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        {this.state.activeApp ? (
          signedIn ? (
            <React.Fragment>
              <Button title='Salir' onPress={() => this.googleSignOut()} />
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
                  showOrHideProductByStores={this.showOrHideProductByStores.bind(
                    this
                  )}
                />
              ) : (
                <ProductSearchResults
                  userName={this.state.name}
                  products={products}
                  showOrHideProductByStores={this.showOrHideProductByStores.bind(
                    this
                  )}
                  googleSignOut={this.googleSignOut.bind(this)}
                />
              )}
            </React.Fragment>
          ) : (
            <LoginPage
              getUser={this.getUser.bind(this)}
              googleSignIn={this.googleSignIn.bind(this)}
            />
          )
        ) : (
          <View style={styles.activeApp}>
            <Text style={styles.title}>Aplicación no activa</Text>
          </View>
        )}
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
    justifyContent: 'center'
  },
  title: {
    color: colors.white
  },
  header: {
    fontSize: 25
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40
  }
});
