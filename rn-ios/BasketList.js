import React from 'react';
import Payment from './Payment.js'
import {
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    PanResponder,
    ListView,
    AsyncStorage,
    NativeModules,
    Alert,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';


let PangPangBridge = NativeModules.PangPangBridge;
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class BasketList extends React.Component {
    state = {
        cardItems: [],
        dataSource: ds,
        totalCount: 0,
        totalPrice: 0,
        navigatorTitle: "Cart",
        showModalCss: {},
        selectedProduct: null,
        // selectedOriginalProduct: null,
    }
    static propTypes = {
        navigator: React.PropTypes.any.isRequired,
        cardId: React.PropTypes.any.isRequired,
    }
    componentDidMount() {
        this.seachCartItems();
        // this._openModal();
    }
    refreshDataSource = (items) => {
        this.setState({ cardItems: items ? items : [] });
        this.computeTatol();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.cardItems),
        });

    }
    computeTatol = () => {
        // console.log(this.state.cardItems.length);
        if (!this.state.cardItems || this.state.cardItems.length === 0) {
            this.setState({ totalPrice: 0 });
            this.setState({ totalCount: 0 });
            return;
        }
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

        });
    }
    seachCartItems = () => {
        if (this.props.cardId) {
            PangPangBridge.callAPI("/cart/get-cart", { cartId: this.props.cardId }).then((card) => {
                var rs = JSON.parse(card);
                // console.log(rs.result.items)
                this.refreshDataSource(rs.result.items);
            });
        }
    }
    _pressBackButton = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
            DeviceEventEmitter.emit('changeTotal');
        }
    }
    _longPressRow = (rowID, rowData) => {

    }

    _goPay = () => {
        PangPangBridge.callAPI("/order/place-order", { cartId: this.props.cardId, info: JSON.stringify({ name: "liche" }) }).then((card) => {
            var rs = JSON.parse(card);
            console.log(rs);
            if (rs.success) {
                AsyncStorage.removeItem("cartId").done((data) => {
                    this.seachCartItems();
                });
            }
        });
    }
    _rowPress = (rowID, rowData) => {
        this._openModal();
        this.setState({ selectedProduct: rowData });
        let copy = this.deepCopy(rowData);
        this.setState({ selectedOriginalProduct: copy });
        // console.log(rowData);
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity onPress={(id, data) => { this._rowPress(rowID, rowData) }} style={styles.row}
            >
                <View style={styles.rowContent}>
                    <Text style={styles.rowContentCode}>{rowData.skuCode}</Text>
                    <Text>x{rowData.quantity}</Text>
                    <Text style={styles.rowContentPrice}>¥{rowData.listPrice}</Text>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }
    _pressPayButton = () => {
        // this.state.totalCount ? Alert.alert(
        //     '提示',
        //     '确定支付？',
        //     [
        //         { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        //         { text: 'OK', onPress: () => this._goPay() },
        //     ]
        // ) : null;

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
        PangPangBridge.callAPI("/cart/remove-item", { cartId: this.props.cardId, skuId: this.state.selectedProduct.skuId, quantity: this.state.selectedOriginalProduct.quantity - this.state.selectedProduct.quantity }).then((card) => {
            var rs = JSON.parse(card);
            this.refreshDataSource(rs.result.items);
            this.setState({ showModalCss: {} });

        });
        // this._closeModal();
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
        var result = {};
        for (var key in source) {
            result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
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
                    <Text style={styles.countText}>TOTAL</Text>
                    <Text style={styles.totalCountText}>¥ {this.state.totalPrice} </Text>
                </View>
                <View style={styles.line}></View>

                <View >
                    <ListView style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
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

let styles;

if (Platform.OS === 'ios') {
    styles = StyleSheet.create({
        modalContainer: {
            // position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
        modalBackGround: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'black',
            opacity: 0.3,
        },
        modalContent: {
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: 350,
            marginTop: Dimensions.get('window').height - 350,
            backgroundColor: 'white',
        },
        modalContentTop: {
            width: Dimensions.get('window').width,
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
            height: 64,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            // backgroundColor:'green',
            marginTop: 20,
            height: 40,
            width: 50,
            // alignSelf:'center',
            // flexDirection: 'row',
            // alignItems: 'center',
            justifyContent: 'center',
        },
        backBtnText: {
            fontSize: 35,
            textAlign: 'center',
            color: 'white',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 20,
            height: 40,
            width: 150,
            justifyContent: 'center',
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        rightBtn: {
            // backgroundColor:'green',
            marginTop: 20,
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
            fontSize: 20,
            // backgroundColor: "transparent",
            // backgroundColor: "red",
            color: 'gray',
            paddingLeft: 20,
        },
        totalCountText: {
            flex: 1,
            fontSize: 30,
            textAlign: 'right',
            alignItems: 'center',
            paddingRight: 20,
            // backgroundColor:"green",
            height: 40,
            lineHeight: 40,
        },
        listView: {
            height: Dimensions.get('window').height - 64 - 60,
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
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

        }
    });
}
else if (Platform.OS === 'android') {
    styles = StyleSheet.create({
        modalContainer: {
            // position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
        modalBackGround: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'black',
            opacity: 0.3,
        },
        modalContent: {
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: 350,
            marginTop: Dimensions.get('window').height - 350,
            backgroundColor: 'white',
        },
        modalContentTop: {
            width: Dimensions.get('window').width,
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
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            // backgroundColor:'green',
            marginTop: 0,
            height: 40,
            width: 50,
            // alignSelf:'center',
            // flexDirection: 'row',
            // alignItems: 'center',
            justifyContent: 'center',
        },
        backBtnText: {
            fontSize: 35,
            textAlign: 'center',
            color: 'white',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 0,
            height: 40,
            width: 150,
            justifyContent: 'center',
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        rightBtn: {
            // backgroundColor:'green',
            marginTop: 0,
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
            fontSize: 20,
            // backgroundColor: "transparent",
            // backgroundColor: "red",
            color: 'gray',
            paddingLeft: 20,
        },
        totalCountText: {
            flex: 1,
            fontSize: 30,
            textAlign: 'right',
            alignItems: 'center',
            paddingRight: 20,
            // backgroundColor:"green",
            height: 40,
            lineHeight: 40,
        },
        listView: {
            height: Dimensions.get('window').height - 64 - 60,
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
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

        }
    });
}