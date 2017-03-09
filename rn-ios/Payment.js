import React, { Component } from 'react';
import CatalogList from './CatalogList.js'
import {
    DeviceEventEmitter,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    NativeModules,
    ListView
} from 'react-native';

import { px2dp, isIOS, deviceW, deviceH } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';
import QRCodeScreen from './QRCodeScreen';


var PangPangBridge = NativeModules.PangPangBridge;
const navigatorTitle = "Payment";


class Payment extends Component {
    state = {
        custNo: '',
        couponNo: '',
        totalCount: 0,
        listPrice: 0,
        salePrice: 0,
        discount: 0,
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
            // console.log(rs.result);
            this.setState({
                listPrice: rs.result.listPrice,
                totalCount: totalCount,
                custNo: (rs.result.customerInfo && rs.result.customerInfo.brandCode) + (rs.result.customerInfo && rs.result.customerInfo.no),
                couponNo: rs.result.couponNo && rs.result.couponNo,
                salePrice: rs.result.salePrice,
                discount: rs.result.discount,
            });
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
        return (
            <TouchableOpacity onPress={() => { this._pressPayType(rowData.id) }}>
                <View style={styles.listItem}>
                    <View />
                    <Text style={styles.itemText}>{rowData.payType}</Text>
                    <Icon name="check-circle-o" style= {[styles.checkIcon, this.state.currentPayId === rowData.id&&{opacity:1}]}  />
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>);
    }
      
    _pressConfirmButton = async () => {
        let setinfoResult = null;
        let param = {
            "cartId": this.props.cardId,
            "payment[alipay]": "testpayment",
            "receipt[name]": "testReceipt",
        }
        await PangPangBridge.callAPI("/cart/set-info", param).then((data) => {
            setinfoResult = JSON.parse(data);
            // console.log(setinfoResult.result.info);
        });

        if (setinfoResult.success) {
            let rs = null;
            await PangPangBridge.callAPI("/order/place-order", { cartId: this.props.cardId }).then((card) => {
                rs = JSON.parse(card);
                // console.log(rs);
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
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _scanCustNo = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: QRCodeScreen,
                title: 'QRCode',
                params: {
                    cancelButtonVisible: true,
                    cancelButtonTitle: "cancel",
                    onSucess: this._scanCustNoSucess,
                    onCancel: this._scanCustNoCancel,
                },
            })
        }
    }
    _scanCustNoSucess = (result) => {
        PangPangBridge.callAPI("/cart/set-customer", { cartId: this.props.cardId, no: result }).then((card) => {
            rs = JSON.parse(card);
            this.setState({ custNo: result });
        });
    }
    _scanCustNoCancel = () => {
        // console.log(this.props.cardId);
        PangPangBridge.callAPI("/cart/set-customer", { cartId: this.props.cardId, no: 'RC10000000001' }).then((card) => {
            rs = JSON.parse(card);
            this.setState({
                custNo: "RC10000000001",
            })
            // console.log(rs);
        });
        // alert('cancel');
    }

    _scanCouponNo = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: QRCodeScreen,
                title: 'QRCode',
                params: {
                    cancelButtonVisible: true,
                    cancelButtonTitle: "cancel",
                    onSucess: this._scanCouponSucess,
                    onCancel: this._scanCouponCancel,
                },
            })
        }
    }
    _scanCouponSucess = (result) => {
        PangPangBridge.callAPI("/cart/set-coupon", { cartId: this.props.cardId, no: result }).then((card) => {
            rs = JSON.parse(card);
            this.setState({
                couponNo: result,
                salePrice: rs.result.salePrice,
                listPrice: rs.result.listPrice,
                discount: rs.result.discount,
            })
        });
    }
    _scanCouponCancel = () => {
        // alert('cancel');
        PangPangBridge.callAPI("/cart/set-coupon", { cartId: this.props.cardId, no: 'WA976CE9199756D5BC' }).then((card) => {
            rs = JSON.parse(card);
            this.setState({
                couponNo: "WA976CE9199756D5BC",
                salePrice: rs.result.salePrice,
                listPrice: rs.result.listPrice,
                discount: rs.result.discount,
            })
            // console.log(rs);
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', height: deviceH }}>
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
                <View style={styles.cust}>
                    <View style={styles.custContent}>
                        {(() => {
                            if (this.state.custNo) {
                                return (<Text style={styles.custText}>{this.state.custNo}</Text>)
                            } else {
                                return (<Text style={styles.custHintText}>scan customer number </Text>)
                            }
                        })()}
                        <TouchableOpacity onPress={this._scanCustNo}>
                            <Icon name="qrcode" style={styles.cashImg} ></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.cust}>
                    <View style={styles.custContent}>
                        {(() => {
                            if (this.state.couponNo) {
                                return (<Text style={styles.custText}>{this.state.couponNo}</Text>)
                            } else {
                                return (<Text style={styles.custHintText}>scan coupon </Text>)
                            }
                        })()}
                        <TouchableOpacity onPress={this._scanCouponNo}>
                            <Icon name="qrcode" style={styles.cashImg} ></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.priceContent}>
                    <Icon name="money" style={styles.cashImg} ></Icon>
                    <Text style={styles.salePriceText}>¥{this.state.salePrice} </Text>
                    <Text style={styles.discountText}>(已优惠 {this.state.discount} 元)</Text>
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
                        <Text style={styles.confirmBtnText}>{"Pay Confirm ￥" + this.state.salePrice.toString()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

let styles;

styles = StyleSheet.create({
    navigatorBar: {
        backgroundColor: "#3e9ce9",
        height: isIOS ? 64 : 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 50,
        justifyContent: 'center',
    },
    navigatorTitle: {
        marginTop: isIOS ? 20 : 0,
        height: 40,
        justifyContent: 'center',
        flex: 1,
    },
    navigatorTitleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
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
    cust: {
        height: 60,
        marginBottom: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    custContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: deviceW * 0.8,
        // backgroundColor: 'red',
    },
    custText: {
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
    },
    custHintText: {
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        color: 'gray',
    },
    priceContent: {
        flexDirection: 'row',
        height: 80,
        marginBottom: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cashImg: {
        fontSize: 40,
        textAlign: 'center',
        color: '#3e9ce9',
    },
    salePriceText: {
        fontSize: 30,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 5,
        fontWeight: '500',
    },
    discountText: {
        fontSize: 18,
        fontWeight: '500',
        color:'orange',
    },
    listView: {
        backgroundColor: 'white',
        marginBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 5,
        width: deviceW,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        width:200,
        textAlign: 'center',
        // backgroundColor: 'red',
    },
    checkIcon: {
        opacity:0,
        fontSize: 20,
        textAlign: 'center',
        color: '#3e9ce9',
        // backgroundColor:'red',
    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: deviceW - 20,
        alignSelf: 'center',
        opacity: 0.4,
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
        width: deviceW * 0.9,
        borderRadius: 10,
    },
    confirmBtnText: {
        color: 'white',
        fontSize: 24,
    }
});

export default Payment;