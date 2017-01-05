import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { LoadLocalStorage, LoadToken, SetToken } from '../common/LocalStorage';
import CatalogList from './CatalogList';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// <Icon name="rocket" size={30} color="#3e9ce9"></Icon>
var PangPangBridge = require('react-native').NativeModules.PangPangBridge;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: "liche1",
      token: "",
      userName: "admin",
      password: "123qwe",
      showLoading: false
    }
  }
  componentDidMount() {
    this.setState({ name: "xiuxiu" });
    var self = this;
    AsyncStorage.getItem("token").then((data) => {
      console.log(data);
    })
    // var storage = LoadLocalStorage();
    // LoadToken(storage, function (exist, data) {
    //   // console.log(exist ? data : "");
    //   var token = exist ? data : "";
    //   self.setState({ token: token })
    // });

  }
  login() {

    let self = this;
    const { navigator } = this.props;
    let userName = this.state.userName;
    let password = this.state.password;
    self.setState({ showLoading: true });

    console.log(PangPangBridge)
    PangPangBridge.login(userName, password).then(
      (data) => {
        var rs = JSON.parse(data);
        console.log(rs)
        // console.log(rs);
        if (rs.success) {
          AsyncStorage.setItem("token", rs.result.token).then((aa) => {
            if (navigator) {
              navigator.replace({
                name: 'CatalogList',
                component: CatalogList,
              })
            }
          })
          // self.setState({ token: rs.result.token });
          // var storage = LoadLocalStorage();
          // SetToken(storage, rs.result.token);
          // self.props.loginComplete();
        } else {
          console.log(rs.error.message);
        }
        self.setState({ showLoading: false });

      }
    );
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
          />
        <View style={styles.inputTextLine} />
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
          />
        <View style={styles.inputTextLine} />

        <TouchableHighlight style={styles.loginButton} underlayColor={'#7fc0ff'} onPress={() => this.login()}>
          {loginButtonContent}
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 300
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