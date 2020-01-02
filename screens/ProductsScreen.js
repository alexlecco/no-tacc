import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ProductSearchResults from '../components/ProductSearchResults';
import ProductByStores from '../components/ProductByStores';

class ProductsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: {},
      ProductByStoresVisible: false,
    };

    showOrHideProductByStores = this.showOrHideProductByStores.bind(this);

  }

  getProducts() {
    const { navigation } = this.props;
    const products = navigation.getParam('products');
    this.state.products = products;
    return this.state.products;
    // console.log('productos enviados de search: ', products);
    // console.log('productos: ', this.state.products);
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


  render() {
    return (
      <View style={styles.container}>
        {this.state.ProductByStoresVisible ? (
          <ProductByStores
            product={product}
            showOrHideProductByStores={this.showOrHideProductByStores.bind(
              this
            )}
          />
        ) : (
          <ProductSearchResults
            products={this.getProducts()}
            showOrHideProductByStores={this.showOrHideProductByStores.bind(
              this
            )}
          />
        )}
      </View>
    );
  }
}
export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
