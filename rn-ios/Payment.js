import React, { Component } from 'react';
import {
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    NativeModules,
    ListView,
    Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const navigatorTitle = "Payment";
class Payment extends Component {
    render() {

        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                </View>
                <View >
                    
                </View>
            </View>
        );
    }
}


let styles;

if (Platform.OS === 'ios') {
    styles = StyleSheet.create({
        navigatorBar: {
            backgroundColor: "#3e9ce9",
            height: 64,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 20,
            height: 40,
            justifyContent: 'center',
            flex: 1,
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
            // backgroundColor:'yellow',
        },
        group: {
            marginTop: 10,
            alignItems: 'center',
        },
        groupTile: {
            margin: 5,
        },
        groupContent: {
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
    });
}
else if (Platform.OS === 'android') {
    styles = StyleSheet.create({
        navigatorBar: {
            backgroundColor: "#3e9ce9",
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            marginTop: 0,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 0,
            height: 40,
            justifyContent: 'center',
            flex: 1,
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
            // backgroundColor:'yellow',
        },
        group: {
            marginTop: 10,
            alignItems: 'center',
        },
        groupTile: {
            margin: 5,
        },
        groupContent: {
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
    });
}

export default componentName;