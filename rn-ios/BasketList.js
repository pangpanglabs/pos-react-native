import React from 'react';
import {
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    View,
    Text,
    TouchableOpacity,
    PanResponder,
    ListView,
    AsyncStorage,
    NativeModules,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';


var PangPangBridge = NativeModules.PangPangBridge;
export default class BasketList extends React.Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            cardItems: [],
            dataSource: ds,
            totalCount: 0,
            totalPrice: 0,
            navigatorTitle: "Cart"
        };
        this._renderRow = this._renderRow.bind(this);
        this.seachCartItems = this.seachCartItems.bind(this);
        this.refreshDataSource = this.refreshDataSource.bind(this);

    }
    componentDidMount() {
        this.seachCartItems();
    }
    refreshDataSource(items) {
        this.setState({ cardItems: items ? items : [] });
        this.computeTatol();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.cardItems),
        });

    }
    computeTatol() {
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
            this.setState({ totalPrice: rs.result.total });
            this.setState({ totalCount: totalCount });

        });
    }
    seachCartItems() {
        if (this.props.cardId) {
            PangPangBridge.callAPI("/cart/get-cart", { cartId: this.props.cardId }).then((card) => {
                var rs = JSON.parse(card);
                // console.log(rs.result.items)
                this.refreshDataSource(rs.result.items);
            });
        }
    }
    _pressBackButton() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
            DeviceEventEmitter.emit('changeTotal');
        }
    }
    _longPressRow(rowID, rowData) {
        // var target = this.state.basketData.concat([]);
        PangPangBridge.callAPI("/cart/remove-item", { cartId: this.props.cardId, skuId: rowData.skuId, quantity: 1 }).then((card) => {
            var rs = JSON.parse(card);
            this.refreshDataSource(rs.result.items);
        });

    }

    _goPay() {
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
    _rowPress() {
        alert(1);
    }
    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onLongPress={(id, data) => { this._longPressRow(rowID, rowData) } } onPress={() => { this._rowPress() } } style={styles.row}
                >
                <View style={styles.rowContent}>
                    <Text style={styles.rowContentCode}>{rowData.skuCode}</Text>
                    <Text>x{rowData.quantity}</Text>
                    <Text style={styles.rowContentPrice}>¥{rowData.price}</Text>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }
    _pressPayButton() {
        this.state.totalCount ? Alert.alert(
            '提示',
            '确定支付？',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                { text: 'OK', onPress: () => this._goPay() },
            ]
        ) : null;
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white', }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressBackButton.bind(this)} style={styles.backBtn}>
                        <Icon style={styles.backBtnText} name="angle-left"></Icon>

                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{this.state.navigatorTitle}({this.state.totalCount})</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressPayButton.bind(this)}>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
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