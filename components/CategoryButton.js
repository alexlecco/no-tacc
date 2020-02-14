import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
class CategoryButton extends Component {
  constructor(props){
    super(props);
  }


  

  getUrl(id){
    return `https://firebasestorage.googleapis.com/v0/b/prceliaco-1cfac.appspot.com/o/categories%2F${id}.jpg?alt=media&token=a8e793a7-556d-4ac0-9c88-af8ffa389010`;
  }


  render() {
    const {title, url, type, idx} = this.props;
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => this.props.getSubcategory(title, type)}>
          <ImageBackground
            source={{uri: this.getUrl(url)}}
            imageStyle={{ borderRadius: 15 }}
            style={styles.image}
          ></ImageBackground>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }
}
export default CategoryButton;

const styles = StyleSheet.create({
  main: {
      paddingTop: 5,
      paddingLeft: 5

  },
  image: {
    width: screenWidth * .25,
    height: screenHeight * .13,
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
    paddingTop: 5
  },

});
