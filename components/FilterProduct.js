import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

class FilterProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      elements: []
    };
  }

  // press(index){
  //   this.props.addFilterOption(index);
  //   this.setState({
  //     options: this.state.options.push(index),
  //     pressStatus: !this.state.pressStatus,
  //   });

  // }

  press(index) {
    if (!this.state.elements.includes(index))
      this.state.elements.push(index);
    else{
      this.state.elements.splice(this.state.elements.indexOf(index), 1)
    };
    console.log('elementos:', this.state.elements);
  }

  isPress(index) {
    if(this.state.elements.includes(index)) {
      console.log(this.state.elements.includes(index));  
      return true;
    }
    else return false;
  }

  render() {
    const elements = this.props.list;
    const buttons = elements.map((item, index) => (
      <TouchableOpacity
        key={item}
        onPress={() => this.press(index)}
        style={this.isPress(index) ? styles.buttonPressed : styles.button}
      >
        <Text style={styles.btnText}>{item}</Text>
      </TouchableOpacity>
    ));

    return <View style={styles.main}>{buttons}</View>;
  }
}
export default FilterProduct;

const styles = StyleSheet.create({
  main: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: Colors.secondaryColor,
    width: '33%',
    margin: 5,
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonPressed: {
    backgroundColor: Colors.secondaryDarkColor,
    margin: 5,
    width: '33%',
    borderRadius: 5

    // opacity: .7,
  },
  btnText: {
    color: Colors.primaryTextColor,
    textAlign: 'center',
    fontSize: 16
  }
});
