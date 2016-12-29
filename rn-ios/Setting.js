import React, { Component } from 'react';

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


class Setting extends Component {
    render() {
        return (
            <View style={{backgroundColor:'blue',height:Dimensions.get("window").height-64,marginTop:64}}>
                <Text>22222</Text>
            </View>
        );
    }
}

export default Setting;

