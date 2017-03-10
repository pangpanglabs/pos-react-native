import React, { Component, PropTypes } from 'react';
import CatalogList from './CatalogList';
import {
    DeviceEventEmitter,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    NativeModules,
    ListView
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH, validateLocaStorage } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const navigatorTitle = "选择卖场";
class SpotSet extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            currentSpotId: 0
        }
    }
    static propTypes = {
        toggle: PropTypes.func.isRequired,
    }
    componentWillMount() {

    }
    componentDidMount() {
        this._getContextUser();
    }
    _getContextUser() {
        PangPangBridge.callAPI("/context/user", null).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs.result);
            if (rs.success) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rs.result.spots),
                    currentSpotId: rs.result.currentSpotId
                });
            } else {
                console.log(rs);
                alert('get user faild')
            }
        });
    }
    async _pressSpot(spotId) {
        // console.log(spotId)
        const { navigator } = this.props;
        let spotsResult = null;
        await PangPangBridge.callAPI("/account/set-spot", { spotId: spotId }).then((data) => {
            spotsResult = JSON.parse(data);
        });

        if (spotsResult.success) {
            await AsyncStorage.setItem("spot", spotsResult.result.currentSpotId.toString());
            this._getContextUser();
        } else {
            console.log(spotsResult.error);
            alert('set spot faild')
        }
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity onPress={() => { this._pressSpot(rowData.id) }}>
                <View style={styles.groupitem}>
                    <Text style={[styles.itemText, this.state.currentSpotId === rowData.id && { color: '#3e9ce9' }]}>
                        {rowData.name}
                    </Text>
                    <Icon name="check-circle-o" style={[styles.checkIcon, this.state.currentSpotId === rowData.id && { opacity: 1 }]} />
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        );
    }
    async _pressMenuButton() {
        if (! await validateLocaStorage()) return;
        this.props.toggle();
    }
    _pressSyncButton() {
        // DeviceEventEmitter.emit('showLoading');
        // PangPangBridge.callAPI("/catalog/download", null).then((data) => {
        //     console.log(JSON.parse(data))
        //     DeviceEventEmitter.emit('dismissLoading');
        //     // if (navigator) {
        //     //     navigator.replace({
        //     //         name: 'CatalogList',
        //     //         component: CatalogList,
        //     //     })
        //     // }
        //     AsyncStorage.setItem("dbDownload", "true");
        // });
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white', height: deviceH }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressMenuButton.bind(this)} style={styles.backBtn}>
                        <Icon name="bars" style={styles.backBtnImg} ></Icon>
                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressSyncButton.bind(this)}>
                        <Icon name="refresh" style={styles.rightBtnImg} ></Icon>
                    </TouchableOpacity>
                </View>
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
        // backgroundColor:'red',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 150,
        justifyContent: 'center',
        flex: 1,
    },
    navigatorTitleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    scrollView: {
        height: deviceH - 64,
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
        // backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
    },
    groupLine: {
        // marginTop: 1,
        height: 0.5,
        backgroundColor: 'gray',
        width: deviceW - 10,
        alignSelf: 'center',
        opacity: 0.4,
    },
    groupitem: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 5,
        width: deviceW,
    },
    itemText: {
        fontSize: 19,
        fontWeight: 'bold',
        width: deviceW,
        textAlign: 'center',
        color: 'gray'
    },
    checkIcon: {
        opacity: 0,
        fontSize: 25,
        left: -25,
        textAlign: 'center',
        color: '#3e9ce9',
    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: deviceW - 20,
        alignSelf: 'center',
        opacity: 0.4,
    },
    backBtnImg: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
    },
    rightBtn: {
        //  backgroundColor:'green',
        marginTop: isIOS ? 20 : 0,
        height: 40,
        width: 50,
        justifyContent: 'center',
    },
    rightBtnImg: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        opacity:0,
    },
});

export default SpotSet;

