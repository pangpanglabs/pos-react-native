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
    AsyncStorage
} from 'react-native';
import BasketList from './BasketList';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = require('react-native').NativeModules.PangPangBridge;

const moreText = "加载完毕";    //foot显示的文案  
//页码  
var pageNum = 0;
//每页显示数据的条数  
const pageSize = 5;

export default class CatalogList extends React.Component {
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
        console.log('changeTotal');
        this.initCard();
    }
    refreshDataSource() {
        var self = this;
        PangPangBridge.getCart(parseInt(this.state.cardId)).then((card) => {
            var rs = JSON.parse(card);
            // console.log(rs.result.items);
            if (!rs.result.items || rs.result.items.length === 0) {
                self.setState({ totalPrice: 0 });
                self.setState({ totalCount: 0 });
                return;
            }

            var totalCount = 0;
            for (var index = 0; index < rs.result.items.length; index++) {
                totalCount = totalCount + parseInt(rs.result.items[index].quantity);
            }

            self.setState({ totalPrice: rs.result.total });
            self.setState({ totalCount: totalCount });
        });
    }
    initCard() {
        var self = this;
        AsyncStorage.getItem("cartId").then((data) => {
            // console.log(data);
            if (data) {
                self.setState({ cardId: parseInt(data) });
                // global.cardId = parseInt(data);
                PangPangBridge.getCart(parseInt(data)).then((card) => {
                    var rs = JSON.parse(card);
                    // console.log(rs.result);
                    self.refreshDataSource();
                });
            } else {
                PangPangBridge.createCart(0).then((data) => {
                    var rs = JSON.parse(data);
                    console.log(rs.result);
                    self.setState({ cardId: parseInt(rs.result.id) });
                    AsyncStorage.setItem("cartId", rs.result.id.toString()).then(() => {
                        self.refreshDataSource();
                        console.log("setItem cartId success:" + rs.result.id);
                    });
                });
            }
        });
    }
    componentDidMount() {
        this.initCard();
        this.subscription = DeviceEventEmitter.addListener('changeTotal', this.changeTotal);
        this.searchProducts();

    }
    searchProducts() {
        var self = this;
        var key = this.state.searchKey;

        PangPangBridge.searchProducts(key ? key : "", pageNum, pageSize).then(
            (data) => {
                var rs = JSON.parse(data);
                // console.log(rs.result);
                if (rs.success) {
                    self.setState({ catalogData: [...self.state.catalogData, ...rs.result] });
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.state.catalogData),
                    });
                    if (rs.result.length < pageSize) {
                        self.setState({ foot: 1 });
                    } else {
                        self.setState({ foot: 0 });
                    }
                } else {
                    self.setState({ foot: 1 });
                    console.log(rs.error.message);
                }

            }
        );
    }
    _pressTopButton() {
        var self = this;
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
        var self = this;
        var rowData = this.state.catalogData[rowID];
        await PangPangBridge.addItem(this.state.cardId, rowData.skuCode, 1).then((data) => {
            var rs = JSON.parse(data);
            console.log(rs.result);
            self.refreshDataSource();
        });

    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={(rowData) => { this._pressRow(rowID) } } style={styles.row}>
                <View style={styles.rowContent}>
                    <Text style={styles.rowContentCode}>{rowData.skuCode}</Text>
                    <Text style={styles.rowContentPrice}>¥{rowData.price}</Text>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }
    _pressMenuButton() {
        const {menuToggle} = this.props;
        menuToggle();
    }
    _pressSearchButton() {
        pageNum = 0;
        this.setState({ catalogData: [] });

        this.searchProducts(this.state.searchKey);
    }
    _renderFooter() {
        if (this.state.foot === 1) {//加载完毕  
            return (
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'flex-start', }}>
                    <Text style={{ color: '#999999', fontSize: 12, marginTop: 10, width: 100 }}>
                        {this.state.moreText}
                    </Text>
                </View>);
        } else if (this.state.foot === 2) {//加载中  
            return (
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ width: 100, height: 20, textAlign: 'center' }} > 加载中</Text>
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
            <View style={{ backgroundColor: 'white', }}>
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
                        />
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressSearchButton.bind(this)}>
                        <Icon name="search" style={styles.backBtnImg} ></Icon>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this._pressTopButton.bind(this)} style={styles.count}>
                    <Text style={styles.countText}>结算({this.state.totalCount})</Text>
                    <Text style={styles.totalCountText}>合计：¥{this.state.totalPrice} </Text>
                </TouchableOpacity>
                <View style={styles.line}></View>

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

const styles = StyleSheet.create({
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
        width: 200,
        backgroundColor: 'white',
        height: 25,
        paddingLeft: 5,
        color: 'gray',
        fontSize: 15,
    },
    rightBtn: {
        //  backgroundColor:'green',
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