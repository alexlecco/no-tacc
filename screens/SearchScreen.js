import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { Button, Icon } from 'native-base';
import Colors from '../constants/Colors';
import { firebaseApp } from '../config/firebase';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      celiacStatus: {},
      textInputStatus: 'untouched',
      food: false,
      item: true,
      products: []
    };
    this.userRef = firebaseApp
      .database()
      .ref()
      .child('users');
    this.productsRef = firebaseApp
      .database()
      .ref()
      .child('products');
  }

  viewClearButton(text) {
    this.setState({
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
    // this.listenForProducts(this.productsRef);
    // this.setState({ ProductByStoresVisible: false });
  }

  renderClearButton() {
    if (this.state.textInputStatus == 'touched') {
      return (
        <TouchableOpacity onPress={() => this.clearText()}>
          <Image
            style={styles.button}
            source={require('../assets/img/clear-input.png')}
          />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  }

  renderSearchBar() {
    return (
      <View style={styles.bar}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => this.viewClearButton(text)}
          onSubmitEditing={() => this.searchProduct()}
          value={this.state.searchText}
          placeholder='Buscar producto'
        />
        {this.renderClearButton()}
      </View>
    );
  }

  async getUserData() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    await this.userRef.once('value', snap => {
      snap.forEach(child => {
        if (child.key === uid)
          this.setState({ celiacStatus: child.val().celiaquia3 });
      });
    });
    // console.log('usuario: ', this.state.user);
  }

  componentDidMount() {
    this.getUserData();
  }

  async searchProduct() {
    // console.log('texto a buscar: ',this.state.searchText);
    // console.log('datos del usuario: ', this.state.celiacStatus);
    const userCeliacStatus = this.state.celiacStatus;
    const searchTxt = this.state.searchText;
    let products = [];
    await this.productsRef.once('value', snap => {
      snap.forEach(child => {
        // console.log('marsh: ',child.val().marsh3Allowed);
        // console.log('celic status: ', userCeliacStatus);
        if (child.val().marsh3Allowed == userCeliacStatus) {
          products.push({
            id: child.val().id,
            name: child.val().name,
            brand: child.val().brand,
            quantity: child.val().quantity,
            marsh3Allowed: child.val().marsh3Allowed,
            _key: child.key
          });
        }
      });
      //? FILTER PRODUCTS BY NAME
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTxt.toLowerCase())
      );
      // console.log('productos buscados: ',products);
      this.props.navigation.navigate('ProductsScreen', { products });
    });
  } //! END SEARCH PRODUCT METHOD

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchOptions}>
          <Text style={styles.title}>
            Ingrese el tipo de producto que desea
          </Text>
          <View style={styles.options}>
            <TouchableOpacity style={styles.option} nextFocusDown='true'>
              {/* <Icon name='logo-angular' /> */}
              <Text style={styles.textOption}>Alimento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              {/* <Icon name='arrow-forward' /> */}
              <Text style={styles.textOption}>Comidas</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>
          <Text>Ingrese el nombre del producto</Text>
          {this.renderSearchBar()}
        </View>
      </SafeAreaView>
    );
  }
}
export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchOptions: {
    flex: 0.5,
    justifyContent: 'center',
    width: '100%'
    // backgroundColor: Colors.primaryLightColor
  },
  searchBar: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    width: '100%'
    // backgroundColor: Colors.secondaryLightColor
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  option: {
    height: 50,
    width: '30%',
    borderRadius: 5,
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 10
  },
  textOption: {
    textAlign: 'center'
  },
  title: {
    padding: 20,
    textAlign: 'center',
    marginBottom: 5
  },
  //------------------------------------------
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
  button: {
    height: 15,
    width: 15,
    marginRight: 20,
    marginLeft: 5
  },
  bar: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center'
  }
});
