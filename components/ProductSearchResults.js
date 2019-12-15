import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
import colors from '../constants/Colors';
import ProductCard from './ProductCard';
import { Spinner } from 'native-base';


export default class ProductSearchResults extends Component {
    render() {
        const { products, showOrHideProductByStores, userName } = this.props;
        const showLogOutButton = false;
        
        return(
            products.length === 0 ?
                <View style={styles.loading}><Text style={styles.title}> Cargando </Text><Spinner></Spinner></View>

                :
                <React.Fragment>
                    <Text style={styles.title}> Bienvenido {userName} </Text>
                    {showLogOutButton && <Button title="salir" onPress={() => this.props.googleSignOut()} />}
                    <Text style={styles.title}> { products.length } productos encontrados </Text>
                    <FlatList
                        style={styles.flatList}
                        data={products}
                        renderItem={product => <ProductCard product={product} showOrHideProductByStores={showOrHideProductByStores} />}
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
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList:{
        flex: .5
    }
});