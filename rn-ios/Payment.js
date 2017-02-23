import React, { Component } from 'react';
import CatalogList from './CatalogList.js'
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
        dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        currentPayId: 1
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
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(
                [{
                    id: 1,
                    payType: 'alipay',
                },
                {
                    id: 2,
                    payType: 'wechatpay',
                },]
            ),
        });
    }
    _pressPayType = (payId) => {
        this.setState({
            currentPayId: payId
        });
    }
    _renderRow = (rowData, sectionID, rowID) => {
        if (this.state.currentPayId === rowData.id) {
            return (
                <TouchableOpacity onPress={() => { this._pressPayType(rowData.id) }}>
                    <View style={styles.groupitem}>
                        <Text style={styles.itemText}>{rowData.payType}    <Icon name="check-circle-o" style={styles.checkIcon} ></Icon></Text>
                    </View>
                    <View style={styles.line}></View>
                </TouchableOpacity>);
        }
        else {
            return (
                <TouchableOpacity onPress={() => { this._pressPayType(rowData.id) }}>
                    <View style={styles.groupitem}>
                        <Text style={styles.itemText}>{rowData.payType}</Text>
                    </View>

                    <View style={styles.line}></View>
                </TouchableOpacity>);
        }
    }

    _pressConfirmButton = async () => {
        let setinfoResult = null;
        await PangPangBridge.callAPI("/cart/set-info", { cartId: this.props.cardId, paymentType: this.state.currentPayId == 1 ? 'alipay' : 'wxpay' }).then((data) => {
            setinfoResult = JSON.parse(data);
        });
        if (setinfoResult.success) {
            let rs = null;
            await PangPangBridge.callAPI("/order/place-order", { cartId: this.props.cardId }).then((card) => {
                rs = JSON.parse(card);
                console.log(rs);
            });

            if (rs.success) {
                AsyncStorage.removeItem("cartId").done((data) => {
                    const { navigator } = this.props;
                    if (navigator) {
                        navigator.replace({
                            name: 'CatalogList',
                            component: CatalogList
                        })
                    }
                });
            }
        }

    }
    _pressBackButton = () => {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressBackButton} style={styles.backBtn}>
                        <Icon style={styles.backBtnText} name="angle-left"></Icon>
                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn}>
                    </TouchableOpacity>
                </View>
                <View style={styles.count}>
                    <View style={styles.countContent}>
                        <Icon name="money" style={styles.cashImg} ></Icon>
                        <Text style={styles.totalCountText}>¥{this.state.totalPrice} </Text>
                    </View>
                </View>
                <View >
                    <ListView style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                    />
                </View>
                <View style={styles.confirmBtnContent}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.confirmBtn} onPress={this._pressConfirmButton}>
                        <Text style={styles.confirmBtnText}>{"Pay Confirm ￥" + this.state.totalPrice.toString()}</Text>
                    </TouchableOpacity>
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
            fontSize: 16,
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
            height: 80,
            marginBottom: 15,
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        countContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: Dimensions.get('window').width * 0.8,
        },
        totalCountText: {
            fontSize: 30,
            textAlign: 'center',
            alignItems: 'center',
            height: 40,
            lineHeight: 40,
        },
        cashImg: {
            fontSize: 40,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        listView: {
            backgroundColor: 'white',
            marginBottom: 30,
        },
        row: {
            height: 80,
        },
        rowContent: {
            flex: 1,
            height: 79,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent:'space-between',
        },
        line: {
            backgroundColor: "gray",
            height: 0.5,
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

        },
        checkIcon: {
            marginLeft: 120,
            fontSize: 20,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        confirmBtnContent: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        confirmBtn: {
            backgroundColor: "#3e9ce9",
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width * 0.9,
            borderRadius: 10,
        },
        confirmBtnText: {
            color: 'white',
            fontSize: 24,
        }
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
            fontSize: 16,
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
            height: 80,
            marginBottom: 15,
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        countContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: Dimensions.get('window').width * 0.8,
        },
        totalCountText: {
            fontSize: 30,
            textAlign: 'center',
            alignItems: 'center',
            height: 40,
            lineHeight: 40,
        },
        cashImg: {
            fontSize: 40,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        listView: {
            backgroundColor: 'white',
            marginBottom: 30,
        },
        row: {
            height: 80,
        },
        rowContent: {
            flex: 1,
            height: 79,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent:'space-between',
        },
        line: {
            backgroundColor: "gray",
            height: 0.5,
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

        },
        checkIcon: {
            marginLeft: 120,
            fontSize: 20,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        confirmBtnContent: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        confirmBtn: {
            backgroundColor: "#3e9ce9",
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width * 0.9,
            borderRadius: 10,
        },
        confirmBtnText: {
            color: 'white',
            fontSize: 24,
        }
    });
}

export default Payment;