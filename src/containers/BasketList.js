import React from 'react';
import Payment from './Payment.js'
import {
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ListView,
    NativeModules,
    Alert
} from 'react-native';
import BasketCell from '../components/BasketCell';
import { px2dp, isIOS, deviceW, deviceH } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';


let PangPangBridge = NativeModules.PangPangBridge;
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class BasketList extends React.Component {
    state = {
        dataSource: ds,
        totalCount: 0,
        totalPrice: 0,
        navigatorTitle: "Cart",
        showModalCss: {},
        selectedProduct: null,
        selectedOriginalProduct: null,
    }
    static propTypes = {
        navigator: React.PropTypes.any.isRequired,
        cardId: React.PropTypes.any.isRequired,
    }
    componentDidMount() {
        this.seachCartItems();
    }
    seachCartItems = () => {
        if (this.props.cardId) {
            DeviceEventEmitter.emit('showLoading');
            PangPangBridge.callAPI("/cart/get-cart", { cartId: this.props.cardId }).then((card) => {
                var rs = JSON.parse(card);
                // console.log(rs.result)
                this.refreshDataSource(rs.result);
                DeviceEventEmitter.emit('dismissLoading');
            });

        }
    }
    refreshDataSource = (result) => {
        this.computeTatol(result);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result.items),
        });

    }
    computeTatol = (result) => {
        // console.log(this.state.cardItems.length);
        if (!result.items || result.items.length === 0) {
            this.setState({ totalPrice: 0, totalCount: 0 });
            return;
        }

        var totalCount = 0;
        for (var index = 0; index < result.items.length; index++) {
            totalCount = totalCount + parseInt(result.items[index].quantity);
        }
        // console.log(rs.result.total);
        this.setState({
            totalPrice: result.listPrice,
            totalCount: totalCount
        });

    }
    _pressBackButton = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
            DeviceEventEmitter.emit('changeTotal');
        }
    }

    _rowPress = (rowData) => {
        this._openModal();
        // console.log(rowData)
        let copy = this.deepCopy(rowData);
        this.setState({ 
            selectedProduct: rowData, 
            selectedOriginalProduct: copy 
        });
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <BasketCell rowData={rowData} onPress={() => this._rowPress(rowData)} />
        )
    }
    _deleteRowConfirm = (rowData, secId, rowId, rowMap) => {
        Alert.alert(
            '提示',
            '确定删除？',
            [
                {
                    text: 'Cancel', onPress: () => {
                        rowMap[`${secId}${rowId}`].closeRow();
                    }
                },
                {
                    text: 'OK', onPress: () => {
                        rowMap[`${secId}${rowId}`].closeRow();
                        PangPangBridge.callAPI("/cart/remove-item", { cartId: this.props.cardId, skuId: rowData.sku.id, quantity: rowData.quantity }).then((card) => {
                            var rs = JSON.parse(card);
                            // console.log(rs);
                            this.refreshDataSource(rs.result);
                        });
                    }
                },
            ]
        );

    }
    _pressPayButton = () => {

        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Payment',
                component: Payment,
                params: {
                    cardId: this.props.cardId
                }
            })
        }
    }
    _modalConfirmBtn = () => {
        // console.log(this.state.selectedProduct);
        PangPangBridge.callAPI("/cart/remove-item", { cartId: this.props.cardId, skuId: this.state.selectedProduct.sku.id, quantity: this.state.selectedOriginalProduct.quantity - this.state.selectedProduct.quantity }).then((card) => {
            var rs = JSON.parse(card);
            this.refreshDataSource(rs.result);
            this.setState({ showModalCss: {} });

        });
        this._closeModal();
    }
    _closeModal = () => {
        this.setState({ showModalCss: {} });
        this.seachCartItems();

    }
    _openModal = () => {
        this.setState({ showModalCss: { position: 'absolute' } });
    }
    _addQty = () => {
        let qty = this.state.selectedProduct.quantity;
        let add = parseInt(qty) + 1;
        let product = this.state.selectedProduct;
        product.quantity = add;
        this.setState({ selectedProduct: product })
    }
    _minusQty = () => {
        let qty = this.state.selectedProduct.quantity;
        if (qty === 0) return;
        let add = parseInt(qty) - 1;
        let product = this.state.selectedProduct;
        product.quantity = add;
        this.setState({ selectedProduct: product })
    }
    deepCopy = (source) => {
        let result = {};
        for (let key in source) {
            result[key] = typeof source[key] === 'object' ?  this.deepCopy(source[key]) : source[key];
        }
        return result;
    }

    render() {

        return (
            <View style={{ backgroundColor: 'white', }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressBackButton} style={styles.backBtn}>
                        <Icon style={styles.backBtnText} name="angle-left"></Icon>

                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{this.state.navigatorTitle}({this.state.totalCount})</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressPayButton}>
                        <Text style={styles.payText}>Pay</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.count} >
                    <Text style={styles.countText}>Total</Text>
                    <Text style={styles.totalCountText}>¥ {this.state.totalPrice} </Text>
                </View>
                <View style={styles.line}></View>

                <View >
                    <SwipeListView style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => this._deleteRowConfirm(data, secId, rowId, rowMap)}>
                                    <Text style={{ color: '#fff' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        rightOpenValue={-75}
                        disableRightSwipe={true}
                    />
                </View>
                <View style={[styles.modalContainer, this.state.showModalCss]} >
                    <TouchableWithoutFeedback onPress={this._closeModal}>
                        <View style={styles.modalBackGround}>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.modalContentTop}>
                            <TouchableOpacity onPress={this._closeModal}><Ionicons style={styles.modalContentTopImg} name="md-close"></Ionicons></TouchableOpacity>
                            <Text>{this.state.selectedProduct ? this.state.selectedProduct.skuCode : ""}</Text>
                            <TouchableOpacity onPress={this._modalConfirmBtn}><Ionicons style={styles.modalContentTopImg} name="md-checkmark"></Ionicons></TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Text>{this.state.selectedOriginalProduct ? this.state.selectedOriginalProduct.quantity : 0}</Text>
                        </View>
                        <View style={styles.line}></View>

                        <View style={{ alignItems: 'center', marginTop: 10, }}>
                            <Text style={{ fontSize: 10, color: 'gray' }}>QUANTITY</Text>
                        </View>
                        <View style={styles.qtyContent}>
                            <TouchableOpacity onPress={this._minusQty}><Ionicons style={styles.modalContentQtyImg} name="md-remove"></Ionicons></TouchableOpacity>
                            <Text style={{ fontSize: 16 }}>{this.state.selectedProduct ? this.state.selectedProduct.quantity : ""}</Text>
                            <TouchableOpacity onPress={this._addQty}><Ionicons style={styles.modalContentQtyImg} name="md-add"></Ionicons></TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        );
    }
}


const modalContentHeight = px2dp(350);
let styles;

styles = StyleSheet.create({
    modalContainer: {
        // position: 'absolute',
        width: deviceW,
        height: deviceH,
    },
    modalBackGround: {
        width: deviceW,
        height: deviceH,
        backgroundColor: 'black',
        opacity: 0.3,
    },
    modalContent: {
        position: 'absolute',
        width: deviceW,
        height: modalContentHeight,
        marginTop: deviceH - modalContentHeight,
        backgroundColor: 'white',
    },
    modalContentTop: {
        width: deviceW,
        height: 40,
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalContentTopImg: {
        fontSize: 30,
        color: '#3e9ce9',
        // backgroundColor:'white',
        marginLeft: 10,
        marginRight: 10,
    },
    qtyContent: {
        // backgroundColor: "yellow",
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
    },
    modalContentQtyImg: {
        fontSize: 35,
        color: '#3e9ce9',
        // backgroundColor:'white',
        marginLeft: 50,
        marginRight: 50,
    },
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
    backBtnText: {
        fontSize: 35,
        textAlign: 'center',
        color: 'white',
    },
    navigatorTitle: {
        // backgroundColor:'red',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 150,
        justifyContent: 'center',
    },
    navigatorTitleText: {
        fontSize: isIOS ? 20 : 0,
        color: 'white',
        textAlign: 'center',
    },
    rightBtn: {
        // backgroundColor:'green',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 50,
        justifyContent: 'center',
    },
    payText: {
        fontSize: 20,
        color: 'white',
    },
    count: {
        // flex:1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1,
        backgroundColor: 'white',
    },
    countText: {
        flex: 1,
        fontSize: 25,
        // backgroundColor: "transparent",
        // backgroundColor: "red",
        fontWeight: '600',
        color: '#3e9ce9',
        paddingLeft: 20,
    },
    totalCountText: {
        flex: 1,
        fontSize: 30,
        textAlign: 'right',
        alignItems: 'center',
        paddingRight: 20,
        fontWeight: '600',
        color: '#3e9ce9',
        height: 40,
        lineHeight: 40,
    },
    listView: {
        height: deviceH - 64 - 60,
    },
    row: {
        // backgroundColor:"red",
        height: 80,
    },
    rowContent: {
        flex: 1,
        height: 79,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
    },
    rowContentCode: {
        flex: 5,
        // backgroundColor:'red',
        paddingLeft: 20,
        fontSize: 16,
    },
    rowContentPrice: {
        flex: 2,
        // backgroundColor:'green',
        paddingRight: 20,
        fontSize: 16,
        textAlign: 'right',
    },
    line: {
        backgroundColor: "gray",
        height: 1,
        width: deviceW - 20,
        alignSelf: 'center',
        opacity: 0.4,

    },
    rowFront: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        // justifyContent: 'center',
        height: 80,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },
});

