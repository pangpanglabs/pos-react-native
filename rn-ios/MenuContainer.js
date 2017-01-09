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
  View
} from 'react-native';
import { signalObj } from './Signals';

export default class MenuContainer extends Component {
  constructor(){
    super();
    this.state={
      isOpen: false,
      selectedItem: '',
      openMenuOffset:Dimensions.get('window').width*3/4,
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected = (item) => {
    // console.log(item)
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
    signalObj.dispatch("naviReplace",item);
  }
  render() {
    const menu = <LeftMenu onItemSelected={this.onMenuItemSelected}/>;

    return (
      <SideMenu 
        menu={menu}
        isOpen={this.state.isOpen}
        openMenuOffset={this.state.openMenuOffset}
        onChange={(isOpen) => this.updateMenuState(isOpen)}
      >
        <Navi {...this.state} updateMenuState={(isOpen) => this.updateMenuState(isOpen)}  />
      </SideMenu>
    );
  }
}
const styles = StyleSheet.create({

});