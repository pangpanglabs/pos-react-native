import React, { Component } from 'react';
import {
    DeviceEventEmitter,
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

var PangPangBridge = NativeModules.PangPangBridge;
const navigatorTitle = "Payment";

class Payment extends Component {
    state = {
        totalCount: 0,
        totalPrice: 0,
    }
    static propTypes = {
        navigator: React.PropTypes.any.isRequired,
        cardId: React.PropTypes.any.isRequired,
    }
    // static defaultProps = {
    //     model: {
    //         id: 0
    //     },
    //     title: 'Your Name'
    // }

    componentDidMount() {
        DeviceEventEmitter.emit('showLoading');
        PangPangBridge.callAPI("/cart/get-cart", { cartId: this.props.cardId }).then((card) => {
            var rs = JSON.parse(card);
            if (!rs.result.items) return;
            var totalCount = 0;
            for (var index = 0; index < rs.result.items.length; index++) {
                totalCount = totalCount + parseInt(rs.result.items[index].quantity);
            }
            // console.log(rs.result.total);
            this.setState({ totalPrice: rs.result.listPrice });
            this.setState({ totalCount: totalCount });
            DeviceEventEmitter.emit('dismissLoading');
        });
    }

    _pressBackButton = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressBackButton.bind(this)} style={styles.backBtn}>
                        <Icon style={styles.backBtnText} name="angle-left"></Icon>
                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn}>
                    </TouchableOpacity>
                </View>
                <View style={styles.count}>
                    <Icon name="shopping-cart" style={styles.cartBtnImg} ></Icon>
                    <View style={styles.totalCountContent}>
                        <Text style={styles.totalCountText}>¥{this.state.totalPrice} </Text>
                    </View>
                    <Icon name="angle-right" style={styles.angleRight} ></Icon>
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
        backBtnText: {
            fontSize: 35,
            textAlign: 'center',
            color: 'white',
        },
        rightBtn: {
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        count: {
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
            backgroundColor: 'white',
        },
        countText: {
            flex: 1,
            fontSize: 12,
            backgroundColor: "transparent",
            width: 30,
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            left: 28,
            top: 19,
        },
        totalCountContent: {
            flex: 1,
            // backgroundColor:"green",
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // color: 'orange'
        },
        totalCountText: {
            fontSize: 30,
            textAlign: 'center',
            alignItems: 'center',
            // backgroundColor:"red",
            height: 40,
            lineHeight: 40,
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
        backBtnText: {
            fontSize: 35,
            textAlign: 'center',
            color: 'white',
        },
        rightBtn: {
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        count: {
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
            backgroundColor: 'white',
        },
        countText: {
            flex: 1,
            fontSize: 12,
            backgroundColor: "transparent",
            width: 30,
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            left: 28,
            top: 19,
        },
        totalCountContent: {
            flex: 1,
            // backgroundColor:"green",
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // color: 'orange'
        },
        totalCountText: {
            fontSize: 30,
            textAlign: 'center',
            alignItems: 'center',
            // backgroundColor:"red",
            height: 40,
            lineHeight: 40,
        },
    });
}

export default Payment;