import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import CatalogList from './CatalogList';
import SpotSet from './SpotSet';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
  NativeModules,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// <Icon name="rocket" size={30} color="#3e9ce9"></Icon>
var PangPangBridge = NativeModules.PangPangBridge;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      userName: "salesman",
      password: "1234",
      showLoading: false
    }
  }
  componentDidMount() {
  }
  login() {
    let userName = this.state.userName;
    let password = this.state.password;
    this.setState({ showLoading: true });

    PangPangBridge.callAPI("/account/login", { tenant: "LABS", username: userName, password: password }).then(
      (data) => {
        var rs = JSON.parse(data);
        // console.log(rs);
        if (rs.success) {
          this.setToken2Storage(rs.result.token);
        } else {
          console.log(rs);
          alert('login faild')
        }
        this.setState({ showLoading: false });

      }
    );
  }
  async setToken2Storage(token) {
    const { navigator } = this.props;
    await AsyncStorage.setItem("token", token);

    if (navigator) {
      navigator.replace({
        name: 'SpotSet',
        component: SpotSet,
      })
    }
  }


  render() {
    let loginButtonContent;
    if (this.state.showLoading) {
      loginButtonContent = <Icon name="spinner" size={25} color="#fff" ></Icon>
    } else {
      loginButtonContent = (
        <Text style={styles.btnText}>
          登录
          </Text>
      )
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => this.setState({ userName: text })}
          value={this.state.userName}
          underlineColorAndroid={'transparent'}
          />
        <View style={styles.inputTextLine} />
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
          />
        <View style={styles.inputTextLine} />

        <TouchableHighlight style={styles.loginButton} underlayColor={'#7fc0ff'} onPress={() => this.login()}>
          {loginButtonContent}
        </TouchableHighlight>

      </View>
    );
  }
}
let styles;

if (Platform.OS === 'ios') {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingTop: 150,
    },

    inputText: {
      height: 40,
      paddingLeft: 10,
      color: 'gray',
      fontSize: 20,

    },
    inputTextLine: {
      width: Dimensions.get('window').width - 10,
      borderWidth: 0.5,
      borderColor: 'gray',
      marginBottom: 10,

    },
    loginButton: {
      marginTop: 20,
      width: Dimensions.get('window').width - 10,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: "#3e9ce9",
      borderRadius: 5,
    },
    btnText: {
      fontSize: 18,
      color: 'white',
    }
  });
}
else if (Platform.OS === 'android') {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingTop: 150,
    },

    inputText: {
      height: 40,
      color: 'gray',
      fontSize: 20,
      width: 200,
      textAlign: 'center',
    },
    inputTextLine: {
      width: Dimensions.get('window').width - 10,
      borderWidth: 0.5,
      borderColor: 'gray',
      marginBottom: 10,

    },
    loginButton: {
      marginTop: 20,
      width: Dimensions.get('window').width - 10,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: "#3e9ce9",
      borderRadius: 5,
    },
    btnText: {
      fontSize: 18,
      color: 'white',
    }
  });
}
