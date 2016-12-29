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

export default class MenuContainer extends Component {
  constructor(){
    super();
    this.state={
      isOpen: false,
      selectedItem: 'About',
      openMenuOffset:Dimensions.get('window').width/2,
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
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }
  render() {
    const menu = <LeftMenu navigator={navigator}/>;

    return (
      <SideMenu 
        menu={menu}
        isOpen={this.state.isOpen}
        openMenuOffset={this.state.openMenuOffset}
        onChange={(isOpen) => this.updateMenuState(isOpen)}
      >
        <Navi {...this.state} menuToggle={() => this.toggle()}  />
      </SideMenu>
    );
  }
}
const styles = StyleSheet.create({

});