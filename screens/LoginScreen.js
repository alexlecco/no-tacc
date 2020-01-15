import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { firebaseApp } from '../config/firebase';
import Colors from '../constants/Colors';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }
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
        androidClientId:              '246004460762-jl6rcssbqu36s3l6vg28h5gd5u8pimbk.apps.googleusercontent.com',
        androidStandaloneAppClientId: '34893812883-bkpmjbnd8alpr3voos79htji42kvpf25.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        // this.storeUser({ name: result.user.name });
        // console.log(this.state.isFirstTime);
        // if(true){
        //   this.props.navigation.navigate('ProfileScreen', {uid: result.user.uid});
        // } else {
        //   this.props.navigation.navigate('SearchScreen', {uid: result.user.uid});
        // }
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
        {/* <Button
            title='ingresá con Google'
            onPress={() => {
              this.googleSignIn();
            }}
          /> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.googleSignIn()}
        >
          <Text style={styles.buttonText}>Ingresá con Google</Text>
        </TouchableOpacity>
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
