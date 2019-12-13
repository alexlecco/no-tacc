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
  Button
} from 'react-native';

import colors from './constants/Colors';
import ProductSearchResults from './components/ProductSearchResults';
import ProductByStores from './components/ProductByStores';

import { firebaseApp } from './config/firebase';
import * as Google from 'expo-google-app-auth';

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" 
       onPress={() => props.signIn()} />
    </View>
  )
}

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
      name: "",
      photoUrl: ""
    };

    this.productsRef = firebaseApp.database().ref().child('products');
    this.activeAppRef = firebaseApp.database().ref().child('activeApp');
    showOrHideProducByStores = this.showOrHideProducByStores.bind(this);
    clearText = this.clearText.bind(this);

    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    YellowBox.ignoreWarnings(['Warning: ...']);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentWillMount() {
    this.listenForProducts(this.productsRef);
    this.listenForActiveApp(this.activeAppRef);
  }

  showOrHideProducByStores(product) {
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
          _key: child.key
        });
      });

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

  signIn = async () => {
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
      } else {
        console.log("cancelled")
      }

    } catch (e) {
      console.log("error", e)
    }
  }

  render() {
    const { products, product } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        {
          this.state.activeApp
          ?
            this.state.signedIn ?
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
                    showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
                  />
                ) : (
                  <ProductSearchResults
                    userName={this.state.name}
                    products={products}
                    showOrHideProducByStores={this.showOrHideProducByStores.bind(this)}
                  />
                )}
              </React.Fragment>
            :
              <LoginPage signIn={this.signIn} />
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
});
