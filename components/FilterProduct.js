import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

class FilterProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOption: this.props.list[-1],
    };
  }

  

  updateActiveOption = (activeOption) => {
    if(activeOption === this.state.activeOption){
      this.state.activeOption = '';
      this.props.addFilterOption(-1);
  }
    else {
      this.setState({
        activeOption,
      });
    }
  };

  render() {
    const elements = this.props.list;
    const buttons = elements.map((item, index) => (
      <TouchableOpacity
        key={item}
        onPress={() => {
          this.props.addFilterOption(index);
          this.updateActiveOption(item);
        }}
        style={this.state.activeOption === item ? styles.buttonPressed : styles.button}
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
    width: '33%',
    margin: 5,
    justifyContent: 'center',
    borderRadius: 5

    // opacity: .7,
  },
  btnText: {
    color: Colors.primaryTextColor,
    textAlign: 'center',
    fontSize: 16
  }
});
