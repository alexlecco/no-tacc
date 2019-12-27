import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class ProductsScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ProductsScreen</Text>
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