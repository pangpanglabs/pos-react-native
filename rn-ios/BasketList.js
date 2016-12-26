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
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
const navigatorTitle = "CardItemList";
var PangPangBridge = require('react-native').NativeModules.PangPangBridge;
export default class BasketList extends React.Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            cardItems: [],
            dataSource: ds,
            totalCount: 0,
            totalPrice: 0,
        };
        this._renderRow = this._renderRow.bind(this);
        this.seachCartItems = this.seachCartItems.bind(this);
        this.refreshDataSource = this.refreshDataSource.bind(this);

    }
    componentDidMount() {
        this.seachCartItems();
    }
    refreshDataSource(items) {
        this.setState({ cardItems: items?items:[] });
        this.computeTatol();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.cardItems),
        });

    }
    computeTatol() {
        var self = this;
        // console.log(this.state.cardItems.length);
        if (!this.state.cardItems || this.state.cardItems.length === 0) {
            self.setState({ totalPrice: 0 });
            self.setState({ totalCount: 0 });
            return;
        }
        PangPangBridge.getCart(parseInt(this.props.cardId)).then((card) => {
            var rs = JSON.parse(card);
            if (!rs.result.items) return;
            var totalCount = 0;
            for (var index = 0; index < rs.result.items.length; index++) {
                totalCount = totalCount + parseInt(rs.result.items[index].quantity);
            }
            // console.log(rs.result.total);
            self.setState({ totalPrice: rs.result.total });
            self.setState({ totalCount: totalCount });

        });
    }
    seachCartItems() {
        var self = this;
        if (this.props.cardId) {
            PangPangBridge.getCart(parseInt(this.props.cardId)).then((card) => {
                var rs = JSON.parse(card);
                // console.log(rs)
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
        var self = this;
        PangPangBridge.removeItem(parseInt(this.props.cardId), rowData.skuCode, 1).then((card) => {
            var rs = JSON.parse(card);
            self.refreshDataSource(rs.result.items);
        });

    }

    _goPay() {
        var self = this;
        PangPangBridge.placeOrder(parseInt(this.props.cardId)).then((card) => {
            var rs = JSON.parse(card);
            console.log(rs);
            AsyncStorage.removeItem("cartId").done((data) => {
                self.seachCartItems();
            });


        });
    }
    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onLongPress={(id, data) => { this._longPressRow(rowID, rowData) } } style={styles.row}
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
    render() {
        return (
            <View style={{ backgroundColor: 'white', }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressBackButton.bind(this)} style={styles.backBtn}>
                        <Icon style={styles.backBtnText} name="chevron-left"></Icon>

                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                    <View style={styles.rightBtn}>
                    </View>
                </View>

                <TouchableOpacity style={styles.count} onPress={() => this._goPay()}>
                    <Text style={styles.countText}>去支付({this.state.totalCount})</Text>
                    <Text style={styles.totalCountText}>合计：¥ {this.state.totalPrice} </Text>
                </TouchableOpacity>
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
        fontSize: 25,
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
    count: {
        height: 60,
        // backgroundColor: "aliceblue",
        flexDirection: 'row',
        alignItems: 'center',
    },
    countText: {
        flex: 1.5,
        fontSize: 16,
        marginLeft: 20,
        backgroundColor: "orange",
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        lineHeight: 40,
        height: 40,

    },
    totalCountText: {
        flex: 5,
        fontSize: 16,
        // backgroundColor:"green",
        textAlign: 'right',
        paddingRight: 20,
        color: 'orange'
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