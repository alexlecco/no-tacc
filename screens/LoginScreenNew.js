import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { firebaseApp } from '../config/firebase';
import Colors from '../constants/Colors';

import { GoogleSignIn } from 'expo-google-sign-in';


class LoginScreen extends Component {
  state = { user: null };

  componentDidMount() {
    this.initAsync();
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync();
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.onSignIn(user);
    alert(user);
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  onSignIn = googleUser => {
    alert('Google Auth Response: ' + googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebaseApp.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebaseApp.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebaseApp
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              if (result.additionalUserInfo.isNewUser) {
                firebaseApp
                  .database()
                  .ref('users/' + result.user.uid)
                  .set({
                    mail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    celiac_status: false //MARSH 3 CELIAC LEVEL FALSE FOR DEFAULT
                  });
              } else {
                // ---------- UPDATE DATA ---------
                // firebaseApp
                //   .database()
                //   .ref('users/' + result.user.uid)
                //   .update({
                //
                //   });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              alert('Google Error: ' + errorMessage);
            });
        } else {
          alert('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  render() {
    return <Text onPress={this.onPress}>Toggle Auth</Text>;
  }

  
  
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderWidth: 1,
    backgroundColor: Colors.secondaryDarkColor,
    borderColor: Colors.secondaryDarkColor,
    width: '80%',
    height: 50,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '400',
    color: 'white'
  }
});
