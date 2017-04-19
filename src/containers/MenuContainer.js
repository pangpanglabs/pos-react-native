import React, { Component } from 'react';
import SideMenu from 'react-native-side-menu';
import Navi from './Navi';
import LeftMenu from './LeftMenu';
import {
  Dimensions,
  TouchableOpacity,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Platform,
  BackAndroid,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { signalObj } from './Signals';

export default class MenuContainer extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      selectedItem: '',
      openMenuOffset: Dimensions.get('window').width * 3 / 4,
    }
  }
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentDidMount() {
    SplashScreen.hide();
  }
  onBackAndroid = () => {
    const nav = global.myNavigator;
    const routers = nav.getCurrentRoutes();
    if (routers.length > 1) {
      nav.pop();
      return true;
    }
    return false;
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  menuStateOnChange = (isOpen) => {
    this.setState({ isOpen });
  }
  onMenuItemSelected = (item) => {
    // console.log(item)
    if (item === 'logout') {
      AsyncStorage.multiRemove(['token', 'spot']).then(() => {
        this.setState({
          isOpen: false,
          // selectedItem: item,
        });
        signalObj.dispatch("naviReplace", 'validate');
      })
    }
    else {
      this.setState({
        isOpen: false,
        selectedItem: item,
      });
      signalObj.dispatch("naviReplace", item);
    }
  }
  render() {
    const menu = <LeftMenu onItemSelected={this.onMenuItemSelected} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        openMenuOffset={this.state.openMenuOffset}
        onChange={this.menuStateOnChange}
      >
        <Navi toggle={this.toggle} />
      </SideMenu>
    );
  }
}
const styles = StyleSheet.create({

});