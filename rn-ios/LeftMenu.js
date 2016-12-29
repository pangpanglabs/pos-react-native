import React, { Component } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
} from 'react-native';
export default class LeftMenu extends Component {
  render() {
    return (
      <View style={styles.menuContainer}>
        <Text >
          111111
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuContainer:{
    flex: 1,
    marginTop:64,
    // justifyContent: 'center',
    backgroundColor: 'red',
  },
});