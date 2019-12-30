import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button, Icon } from 'native-base';
import Colors from '../constants/Colors';

class SearchScreen extends Component {
  constructor(props){
    super(props);
  }
  filterSearch(text) {
    // let filteredProducts = this.state.allProducts.filter(product =>
      // product.name.toLowerCase().includes(text.toLowerCase())
    // );

    // this.setState({
      // products: filteredProducts,
      // searchText: text,
      // textInputStatus: 'touched'
    // });
  }

  clearText() {
    // this.setState({
    //   textInputStatus: 'untouched',
    //   searchText: ''
    // });

    // this.restartSearch();
  }

  restartSearch() {
    // this.listenForProducts(this.productsRef);
    // this.setState({ ProductByStoresVisible: false });
  }

  renderClearButton() {
    // if (this.state.textInputStatus == 'touched') {
    //   return (
    //     <TouchableOpacity onPress={() => this.clearText()}>
    //       <Image
    //         style={styles.button}
    //         source={require('./assets/img/clear-input.png')}
    //       />
    //     </TouchableOpacity>
    //   );
    // } else {
    //   return <View />;
    // }
  }


  renderSearchBar(){
    return (
      <Text>SEARCH BAR</Text>

    );
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchOptions}>
          <Text style={styles.title}>Ingrese el tipo de producto que desea</Text>
          <View style={styles.options}>
            <TouchableOpacity  style={styles.option} nextFocusDown="true">
              {/* <Icon name='logo-angular' /> */}
              <Text style={styles.textOption}>Alimento</Text>
            </TouchableOpacity >
            <TouchableOpacity  style={styles.option}>
              {/* <Icon name='arrow-forward' /> */}
              <Text style={styles.textOption}>Comidas</Text>
            </TouchableOpacity >
          </View>
        </View>
        <View style={styles.searchBar}>
          <Text>Por favor, Ingrese el nombre del producto</Text>
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
    flex: .5,
    justifyContent: 'center',
    width: '100%',
    // backgroundColor: Colors.primaryLightColor
  },
  searchBar: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    width: '100%',
    // backgroundColor: Colors.secondaryLightColor
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    height: 50,
    width: '30%',
    borderRadius: 5,
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 10
  },
  textOption: {
    textAlign: 'center',
  },
  title: {
    padding: 20,
    textAlign: 'center',
    marginBottom: 5
  }
});
