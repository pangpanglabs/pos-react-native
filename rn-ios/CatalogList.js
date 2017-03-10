import React from 'react';
import {
    DeviceEventEmitter,
    ListView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    NativeModules,
    Keyboard
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH } from '../util';
import BasketList from './BasketList';
import ProductCell from './ProductCell';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const moreText = "没有更多的数据";    //foot显示的文案  
//页码  
var pageNum = 0;
//每页显示数据的条数  
const pageSize = 10;

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class CatalogList extends React.Component {

    state = {
        searchKey: "",
        dataSource: ds,
        totalPrice: 0,
        totalCount: 0,
        cardId: 0,
        foot: 0, // 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中
    }
    static propTypes = {
        toggle: React.PropTypes.func.isRequired,
        navigator: React.PropTypes.any.isRequired,
    };

    componentWillMount() {
        this.subscription = DeviceEventEmitter.addListener('changeTotal', this.changeTotal);
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.subscription.remove();
        // this.keyboardDidShowListener.remove();
        // this.keyboardDidHideListener.remove();
    }
    // _keyboardDidShow() {
    //     // alert('Keyboard Shown');
    // }

    // _keyboardDidHide() {
    //     // alert('Keyboard Hidden');
    // }
    async componentDidMount() {
        await setTimeout(() => {
            this.initCard();
        }, 300);
        await setTimeout(() => {
            this.searchProducts();
        }, 300);
    }

    changeTotal = (data) => {
        this.initCard();
    }
    refreshCartData = () => {
        PangPangBridge.callAPI("/cart/get-cart", { cartId: this.state.cardId }).then((card) => {
            var rs = JSON.parse(card);
            // console.log(rs.result);
            if (!rs.result.items || rs.result.items.length === 0) {
                this.setState({ totalPrice: 0 });
                this.setState({ totalCount: 0 });
                return;
            }

            var totalCount = 0;
            for (var index = 0; index < rs.result.items.length; index++) {
                totalCount = totalCount + parseInt(rs.result.items[index].quantity);
            }

            this.setState({ totalPrice: rs.result.listPrice });
            this.setState({ totalCount: totalCount });
        });
    }
    initCard = () => {
        AsyncStorage.getItem("cartId").then((data) => {
            if (data) {
                this.setState({ cardId: parseInt(data) });
                PangPangBridge.callAPI("/cart/get-cart", { cartId: data }).then((card) => {
                    var rs = JSON.parse(card);
                    // console.log(rs.result);
                    this.refreshCartData();
                });
            } else {
                PangPangBridge.callAPI("/cart/create-cart", null).then((data) => {
                    var rs = JSON.parse(data);
                    this.setState({ cardId: parseInt(rs.result.id) });
                    AsyncStorage.setItem("cartId", rs.result.id.toString()).then(() => {
                        this.refreshCartData();
                        // console.log("setItem cartId success:" + rs.result.id);
                    });
                });
            }
        });
    }

    searchProducts = async () => {
        var key = this.state.searchKey;
        DeviceEventEmitter.emit('showLoading');
        await PangPangBridge.callAPI("/catalog/search-contents", { q: key, skipCount: pageSize * pageNum, maxResultCount: pageSize }).then(
            (data) => {
                var rs = JSON.parse(data);
                // console.log("search->", rs.result, pageNum);
                if (rs.success && rs.result.items !== null) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(rs.result.items),
                    });

                    if (rs.result.items.length < pageSize) {
                        this.setState({ foot: 1 });
                    } else {
                        this.setState({ foot: 0 });
                    }
                } else {
                    this.setState({ foot: 1, dataSource: this.state.dataSource.cloneWithRows([]) });
                }
            }
        );
        DeviceEventEmitter.emit('dismissLoading');
    }
    searchMoreProducts = async () => {
        var key = this.state.searchKey;
        DeviceEventEmitter.emit('showLoading');
        await PangPangBridge.callAPI("/catalog/search-contents", { q: key, skipCount: pageSize * pageNum, maxResultCount: pageSize }).then(
            (data) => {
                var rs = JSON.parse(data);
                // console.log("more", rs.result);
                // console.log("more", this.state.dataSource._dataBlob.s1);
                if (rs.success && rs.result.items !== null) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows([...this.state.dataSource._dataBlob.s1, ...rs.result.items]),
                    });

                    if (rs.result.items.length < pageSize) {
                        this.setState({ foot: 1 });
                    } else {
                        this.setState({ foot: 0 });
                    }
                } else {
                    this.setState({ foot: 1 });
                }
            }
        );
        DeviceEventEmitter.emit('dismissLoading');
    }

    _pressTopButton = () => {
        pageNum = 0;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BasketList',
                component: BasketList,
                params: {
                    cardId: this.state.cardId
                }
            })
        }
    }
    _genRows = () => {
        // const dataBlob = [];
        // for(let i = 0 ; i< 30 ; i ++ ){
        //     dataBlob.push("aa"+i);
        // }
        // return dataBlob;
    }

    _pressRow = (rowData) => {
        PangPangBridge.callAPI("/cart/add-item", { cartId: this.state.cardId, skuId: rowData.id, quantity: 1 }).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs);
            this.refreshCartData();
        });
    }

    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <ProductCell rowData={rowData} onPress={() => { this._pressRow(rowData) }} ></ProductCell>
        )
    }
    _pressMenuButton = () => {
        this.props.toggle();
    }
    _pressSearchButton = async () => {
        pageNum = 0;
        this.searchProducts();
    }
    _renderFooter = () => {
        if (this.state.foot === 1) {//加载完毕  
            return (
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ color: '#999', fontSize: 13, marginTop: 1, width: 100, textAlign: 'center' }}>
                        {moreText}
                    </Text>
                </View>);
        } else if (this.state.foot === 2) {//加载中  
            return (
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ width: 100, height: 20, fontSize: 13, textAlign: 'center' }} > 加载中</Text>
                </View>);
        }
    }
    _endReached = async () => {
        if (this.state.foot != 0) {
            return;
        }
        this.setState({ foot: 2, });

        this.timer = setTimeout(
            () => {
                pageNum++;
                this.searchMoreProducts();
            }, 500);
    }
    _keboardSubmit = () => {
        this.searchProducts();
    }
    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressMenuButton} style={styles.backBtn}>
                        <Icon name="bars" style={styles.backBtnImg} ></Icon>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputSearchText}
                        onChangeText={(text) => this.setState({ searchKey: text })}
                        value={this.state.searchKey}
                        placeholder="搜索"
                        clearButtonMode="always"
                        underlineColorAndroid={'transparent'}
                        returnKeyType='search'
                        onSubmitEditing={this._keboardSubmit}
                    />
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressSearchButton}>
                        <Icon name="search" style={styles.searchBtnImg} ></Icon>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this._pressTopButton} style={styles.count}>
                    <Icon name="shopping-cart" style={styles.cartBtnImg} ></Icon>
                    <Text style={styles.countText}>{this.state.totalCount}</Text>

                    <View style={styles.totalCountContent}>
                        <Text style={styles.totalCountText}>¥{this.state.totalPrice} </Text>
                    </View>
                    <Icon name="angle-right" style={styles.angleRight} ></Icon>
                </TouchableOpacity>

                <View >
                    <ListView style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        renderFooter={this._renderFooter}
                        onEndReached={this._endReached}
                        onEndReachedThreshold={20}
                        pageSize={pageSize}
                    />
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
        // backgroundColor: 'green',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 50,
        // alignSelf:'center',
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    backBtnImg: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
    },
    inputSearchText: {
        padding: 0,
        marginTop: isIOS ? 29 : 0,
        width: deviceW - 100,
        backgroundColor: 'white',
        height: 25,
        paddingLeft: 10,
        color: 'black',
        fontSize: 15,
        borderRadius: 12,
        opacity: 0.5,
    },
    rightBtn: {
        //  backgroundColor:'green',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 50,
        justifyContent: 'center',
    },
    searchBtnImg: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
    },
    count: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: 'white',
    },
    cartBtnImg: {
        fontSize: 40,
        textAlign: 'center',
        color: '#3e9ce9',
        marginLeft: 20,
    },
    countText: {
        flex: 1,
        fontSize: 12,
        backgroundColor: "transparent",
        // backgroundColor: "red",
        width: 30,
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        left: 28,
        top: 18,
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
        fontWeight: '600',
        color: '#3e9ce9',
        height: 40,
        lineHeight: 40,
    },
    angleRight: {
        fontSize: 30,
        // backgroundColor:"black",
        color: '#b9b9b9',
        marginRight: 20,

    },
    listView: {
        height: deviceH - (isIOS ? 64 : 44) - 60,
        backgroundColor: 'white',
    },
});
