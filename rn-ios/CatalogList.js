import React from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    ListView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    NativeModules,
    Platform
} from 'react-native';
import BasketList from './BasketList';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const moreText = "加载完毕";    //foot显示的文案  
//页码  
var pageNum = 0;
//每页显示数据的条数  
const pageSize = 10;

export default class CatalogList extends React.Component {
    static propTypes = {
        updateMenuState: React.PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            searchKey: "",
            catalogData: [],
            dataSource: ds,
            totalPrice: 0,
            totalCount: 0,
            cardId: 0,
            loaded: false,//控制Request请求是否加载完毕
            foot: 0, // 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中

        };
        this.searchProducts = this.searchProducts.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.changeTotal = this.changeTotal.bind(this);
        this.initCard = this.initCard.bind(this);
        this.refreshDataSource = this.refreshDataSource.bind(this);
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    changeTotal(data) {
        // console.log('changeTotal');
        this.initCard();
    }
    refreshDataSource() {
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
    initCard() {
        AsyncStorage.getItem("cartId").then((data) => {
            // console.log(data);
            if (data) {
                this.setState({ cardId: parseInt(data) });
                // global.cardId = parseInt(data);
                PangPangBridge.callAPI("/cart/get-cart", { cartId: data }).then((card) => {
                    var rs = JSON.parse(card);
                    // console.log(rs.result);
                    this.refreshDataSource();
                });
            } else {
                PangPangBridge.callAPI("/cart/create-cart", null).then((data) => {
                    var rs = JSON.parse(data);
                    console.log(rs.result);
                    this.setState({ cardId: parseInt(rs.result.id) });
                    AsyncStorage.setItem("cartId", rs.result.id.toString()).then(() => {
                        this.refreshDataSource();
                        console.log("setItem cartId success:" + rs.result.id);
                    });
                });
            }
        });
    }

    componentWillMount() {
        setTimeout(() => {
            this.initCard();
            this.subscription = DeviceEventEmitter.addListener('changeTotal', this.changeTotal);
            this.searchProducts();
        }, 300);
    }

    searchProducts() {
        var key = this.state.searchKey;

        PangPangBridge.callAPI("/catalog/search-products", { q: key, skipCount: pageSize * pageNum, maxResultCount: pageSize }).then(
            (data) => {
                var rs = JSON.parse(data);
                // console.log(rs.result);
                if (rs.success) {
                    this.setState({ catalogData: [...this.state.catalogData, ...rs.result.items] });
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.state.catalogData),
                    });
                    if (pageSize * pageNum > rs.result.totalCount) {
                        this.setState({ foot: 1 });
                    } else {
                        this.setState({ foot: 0 });
                    }
                } else {
                    this.setState({ foot: 1 });
                    console.log(rs.error.message);
                }

            }
        );
    }
    _pressTopButton() {
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
    _genRows() {
        // const dataBlob = [];
        // for(let i = 0 ; i< 30 ; i ++ ){
        //     dataBlob.push("aa"+i);
        // }
        // return dataBlob;
    }

    async _pressRow(rowID) {
        var rowData = this.state.catalogData[rowID];
        console.log(this.state.cardId + " " + rowData.skuId);
        await PangPangBridge.callAPI("/cart/add-item", { cartId: this.state.cardId, skuId: rowData.skuId, quantity: 1 }).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs);
            this.refreshDataSource();
        });

    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={(rowData) => { this._pressRow(rowID) } } style={styles.row}>
                <View style={styles.rowContent}>
                    <Text style={styles.rowContentCode}>{rowData.skuCode}</Text>
                    <Text>{rowData.skuId}</Text>
                    <Text style={styles.rowContentPrice}>¥{rowData.listPrice}</Text>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }
    _pressMenuButton() {
        const {updateMenuState} = this.props;
        updateMenuState(true);
    }
    _pressSearchButton() {
        pageNum = 0;
        this.setState({ catalogData: [] });

        this.searchProducts(this.state.searchKey);
    }
    _renderFooter() {
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
    _endReached() {
        console.log("_endReached");
        if (this.state.foot != 0) {
            return;
        }
        this.setState({
            foot: 2,
        });
        this.timer = setTimeout(
            () => {
                pageNum++;
                // this._fetchListData();
                this.searchProducts();

            }, 500);
    }
    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressMenuButton.bind(this)} style={styles.backBtn}>
                        <Icon name="bars" style={styles.backBtnImg} ></Icon>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputSearchText}
                        onChangeText={(text) => this.setState({ searchKey: text })}
                        value={this.state.searchKey}
                        placeholder="搜索"
                        clearButtonMode="always"
                        underlineColorAndroid={'transparent'}
                        />
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressSearchButton.bind(this)}>
                        <Icon name="search" style={styles.searchBtnImg} ></Icon>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this._pressTopButton.bind(this)} style={styles.count}>
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
                        renderFooter={this._renderFooter.bind(this)}
                        onEndReached={this._endReached.bind(this)}
                        onEndReachedThreshold={0}
                        />
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
            // backgroundColor: 'green',
            marginTop: 20,
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
            marginTop: 29,
            width: Dimensions.get('window').width - 100,
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
            marginTop: 20,
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
        angleRight: {
            fontSize: 30,
            // backgroundColor:"black",
            color: '#b9b9b9',
            marginRight: 20,

        },
        listView: {
            height: Dimensions.get('window').height - 64 - 60,
            backgroundColor: 'white',
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
            height: 0.5,
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

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
            // backgroundColor: 'green',
            marginTop: 0,
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
            width: Dimensions.get('window').width - 100,
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
            marginTop: 0,
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
        angleRight: {
            fontSize: 30,
            // backgroundColor:"black",
            color: '#b9b9b9',
            marginRight: 20,

        },
        listView: {
            height: Dimensions.get('window').height - 64 - 60,
            backgroundColor: 'white',
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
            height: 0.5,
            width: Dimensions.get('window').width - 20,
            alignSelf: 'center',
            opacity: 0.4,

        }
    });
}