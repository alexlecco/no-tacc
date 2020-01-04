import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Picker, Button, Icon } from 'native-base';

import { firebaseApp } from '../config/firebase';
import colors from '../constants/Colors';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: ''
      },
      selected: 'key0'
    };
    this.userRef = firebaseApp
      .database()
      .ref()
      .child('users');
  }
  async getUserData() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    await this.userRef.once('value', snap => {
      snap.forEach(child => {
        if (child.key === uid)
          this.setState({
            user: {
              celiacStatus: child.val().celiaquia3,
              first_name: child.val().first_name,
              last_name: child.val().last_name,
              profile_picture: child.val().profile_picture
            }
          });
      });
    });
    // console.log('usuario: ', this.state.user);
  }

  componentDidMount() {
    this.getUserData();
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}></View>
        <Image
          style={styles.avatar}
          source={{ uri: this.state.user.profile_picture }}
        />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>
              {this.state.user.last_name + ', ' + this.state.user.first_name}
            </Text>
            <Text style={styles.info}>Grado de Celiaquia: </Text>
            <Picker
              note
              mode='dropdown'
              style={styles.picker}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item label='Grado 1: Leve/Moderado' value='key0' />
              <Picker.Item label='Grado 2: Grave' value='key1' />
            </Picker>
          </View>
          <View style={styles.floatAB}>
            <Button iconRight light>
              <Text>Next</Text>
              <Icon name='arrow-forward' />
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDarkColor,
    height: 200
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 1.5,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  name: {
    fontSize: 28,
    color: colors.primaryTextColor,
    fontWeight: '600'
  },
  info: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: colors.secondaryColor
  },
  picker: {
    width: '100%',
    color: colors.primaryTextColor,
    fontSize: 16
  },
  floatAB: {
    flex: 3,
    display: 'none', //! PLS BORRAR
  }
});
