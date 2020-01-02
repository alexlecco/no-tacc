import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import firebase from 'firebase';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          const uid = user.uid;
          this.props.navigation.navigate('SearchScreen', { uid });
        } else {
          this.props.navigation.navigate('LoginScreen');
        }
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
}
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
