import React, { Component } from 'react';
import { Picker, StyleSheet, Text, View, Image, SafeAreaView, Button, ActivityIndicator } from 'react-native';
import { Icon } from 'native-base';

import { firebaseApp } from '../config/firebase';
import colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        celiac_status: false
      },
      selected: 'key0',
      isUser: false,
    };
    const { navigation } = this.props;
    uid = navigation.getParam('uid');
    this.userRef = firebaseApp
      .database()
      .ref('users/' + uid);
  }
  async getUserData() {
    await this.userRef.once('value', snap => {
          this.setState({
            user: {
              uid: snap.key,
              celiac_status: snap.val().celiac_status,
              first_name: snap.val().first_name,
              last_name: snap.val().last_name,
              profile_picture: snap.val().profile_picture
            },
            isUser: true
          });
          this.state.user.celiac_status ? this.onValueChange('key1') : this.onValueChange('key0');
    });
    // console.log('usuario: ', this.state.user);
  }

  componentDidMount() {
    // setTimeout(()=>this.getUserData(), 2000);
    this.getUserData();
  }

  componentWillReceiveProps(){
    this.getUserData();
  }


  onValueChange(value) {
    this.setState({
      selected: value
    });
    switch(value){
      case 'key0':
        this.state.user.celiac_status = false;
        break;
      case 'key1':
        this.state.user.celiac_status = true;
        break;
    }
    // console.log(this.state.user);
  }



  next(){
    this.onValueChange(this.state.selected);
    this.userRef.update({celiac_status: this.state.user.celiac_status});
    this.props.navigation.navigate('SearchScreen', {uid: this.state.user.uid});
  }


  render() {
    return (
      <SafeAreaView>
        {this.state.isUser?(
           <React.Fragment>
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
            <View style={styles.button}>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> this.next()}>
                <Text>Continuar </Text>
                <Icon name='arrow-forward' /> 
              </TouchableOpacity>
            </View>
        </View>
        </React.Fragment>
        ):
          <ActivityIndicator style={styles.load} size='large' />
        }
      </SafeAreaView>
    );
  }
}
export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDarkColor,
    height: 200
  },
  load: {
    paddingTop: 320
  }
  ,
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 1.5,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
    backgroundColor: 'white'
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
    marginHorizontal: 10
  },
  description: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginTop: 10,
    textAlign: 'center'
  },
  picker: {
    width: '80%',
    color: colors.primaryTextColor,
    fontSize: 16,
    // backgroundColor: colors.secondaryColor,
  },
  button: {
    flexDirection: 'row',
    marginBottom: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
    marginTop: 350,
    paddingRight: 10
  }
});
