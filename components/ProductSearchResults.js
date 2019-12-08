import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import colors from '../constants/Colors';
import ProductCard from './ProductCard';
import { Spinner } from 'native-base';


export default class ProductSearchResults extends Component {
    render() {
        const { products, showOrHideProducByStores } = this.props;
        
        return(
            products.length === 0 ?
                <View><Text style={styles.title}> Cargando </Text><Spinner></Spinner></View>
                :
                <React.Fragment>
                    <Text style={styles.title}> { products.length } productos encontrados </Text>
                    <FlatList
                        style={styles.flatList}
                        data={products}
                        renderItem={product => <ProductCard product={product} showOrHideProducByStores={showOrHideProducByStores} />}
                        keyExtractor={(product, index) => { return product.id.toString() }}
                    />
                </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    title: {
      color: colors.white,
      textAlign: 'center',
      paddingTop: 20,
      paddingBottom: 5
    },
    flatList:{
      flex: .5
    }
});
  