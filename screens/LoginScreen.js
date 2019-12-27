import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { firebaseApp } from '../config/firebase';

class LoginScreen extends Component {
  //SIGN IN FLOW f/ FIREBASE
  onSignIn = googleUser => {
    // console.log('Google Auth Response', googleUser);
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
                // console.log('result:', result);
                // console.log(JSON.stringify(result));
                // console.log('Google sign in');
                firebaseApp
                  .database()
                  .ref('users/' + result.user.uid)
                  .set({
                    mail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    celiaquia3: false //MARSH 3 CELIAC LEVEL FALSE FOR DEFAULT
                  })
                  .then(function(snapshot) {
                    // console.log('Snapshot: ',snapshot);
                  });
              } else {
                firebaseApp
                  .database()
                  .ref('users/' + result.user.uid)
                  .update({
                    //UPDATE DATA
                  });
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
              console.log('Google Error', errorMessage);
            });
        } else {
          console.log('User already signed-in Firebase.');
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

  async googleSignIn() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          '246004460762-6ac3ug1la8sill81a2j03vkl1oo1rhgu.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        // this.setState({
        //   signedIn: true,
        //   name: result.user.name,
        //   photoUrl: result.user.photoUrl
        // });
        // this.storeUser({ name: result.user.name });
      } else {
        console.log('cancelled');
      }
    } catch (e) {
      console.log('error', e);
    }
  }
  async googleSignOut() {
    AsyncStorage.clear();
    // this.setState({ signedIn: false, name: '' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title='ingresá con Google'
          onPress={() => {
            this.googleSignIn();
          }}
        />
      </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});