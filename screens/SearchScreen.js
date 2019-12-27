import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import Colors from '../constants/Colors';

class SearchScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchOptions}>
          <Text>Ingrese el tipo de producto que desea</Text>
          <View style={styles.options}>
            <Button
              style={styles.option}
              title='Alimentos'
              onPress={() => {
                alert('alimentos');
              }}
            />
            <Button
              style={styles.option}
              title='Comidas'
              onPress={() => {
                alert('comida');
              }}
            />
          </View>
        </View>
        <View style={styles.searchBar}>
          <Text>Por favor, Ingrese el nombre del producto</Text>
          <Text>SEARCH BAR</Text>
        </View>
      </SafeAreaView>
    );
  }
}
export default SearchScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    searchOptions:{
        flex: 3,
        justifyContent: 'center',
        // alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.primaryLightColor
    },
    searchBar:{
        flex: 4,
        paddingTop: 30,
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.secondaryLightColor,
    },
    options:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    option:{
        height: 50,
        width: 100,
        paddingVertical: 10
    },
});
