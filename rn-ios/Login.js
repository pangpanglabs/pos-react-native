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
import { px2dp, isIOS, deviceW, deviceH } from '../util';
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
        <View style={styles.backContainer}>

        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => this.setState({ userName: text })}
            value={this.state.userName}
            defaultValue='Username/id'
            underlineColorAndroid={'transparent'}
          />
          <View style={styles.inputTextLine} />
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
            defaultValue='Password'
            secureTextEntry={true}
            underlineColorAndroid={'transparent'}
          />
          <View style={styles.inputTextLine} />

          <TouchableHighlight style={styles.loginButton} underlayColor={'#7fc0ff'} onPress={() => this.login()}>
            {loginButtonContent}
          </TouchableHighlight>
        </View>
        <View style={styles.withoutBackContainer}>
          <Text style={styles.versionText}>Pang Pang Pos V1.0</Text>
        </View>
      </View>
    );
  }
}
let styles;

styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  backContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: '#3e9ce9'
  },
  withoutBackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  versionText: {
    color: 'rgb(178,178,178)',
  },
  formContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 50,
    padding: 20,
    top: Dimensions.get('window').height * 0.38,
    borderColor: 'rgb(201,216,218)',
    borderRadius: 5,
    borderWidth: 2,
    position: 'absolute',
  },
  inputText: {
    height: 40,
    color: 'gray',
    fontSize: 20,
    width: 200,
    textAlign: 'center',
  },
  inputTextLine: {
    width: Dimensions.get('window').width - 130,
    borderWidth: 0.5,
    borderColor: 'gray',
    marginBottom: 10,

  },
  loginButton: {
    marginTop: 20,
    width: Dimensions.get('window').width - 130,
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
