import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ListView,
    NativeModules,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { px2dp, isIOS, deviceW, deviceH } from '../util';

var PangPangBridge = NativeModules.PangPangBridge;

let tempMenuData = [
    { menuName: "销售", menuCode: "catalogList" },
    { menuName: "卖场", menuCode: "spotset" },
    // { menuName: "user", menuCode: "user" },
    // { menuName: "settings", menuCode: "settings" },
];


export default class LeftMenu extends Component {
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(tempMenuData),
            userName: '',
        };
        this._renderRow = this._renderRow.bind(this);
    }

    componentWillMount() {
        this.subscription = DeviceEventEmitter.addListener('refreshUser', this.refreshUser);

    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    componentDidMount() {
        AsyncStorage.getItem("spot").then((spot) => {
            spot && this._getContextUser();
        })
    }

    _getContextUser() {
        PangPangBridge.callAPI("/context/user", null).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs.result);
            if (rs.success) {
                this.refreshUser(rs.result.userName)
            } else {
                console.log(rs);
                alert('get user faild from leftMenu')
            }
        });
    }
    refreshUser = (userName) => {
        userName && this.setState({ userName: userName });
    }
    _pressRow(rowID) {
        // console.log(tempMenuData[rowID].menuCode);
        // console.log(this.props.onItemSelected);
        const { onItemSelected } = this.props;
        onItemSelected(tempMenuData[rowID].menuCode);

    }
    _renderRow(rowData, sectionID, rowID) {
        let iconContent;
        if (rowData.menuCode === "user") {
            iconContent = <Icon name="user-o" style={styles.backBtnImg} ></Icon>
        }
        if (rowData.menuCode === "catalogList") {
            iconContent = <Icon name="shopping-cart" style={styles.backBtnImg} ></Icon>
        }
        if (rowData.menuCode === "settings") {
            iconContent = <Icon name="cog" style={styles.backBtnImg} ></Icon>
        }
        if (rowData.menuCode === "logout") {
            iconContent = <Icon name="sign-out" style={styles.backBtnImg} ></Icon>
        }
        if (rowData.menuCode === "spotset") {
            iconContent = <Icon name="bank" style={styles.backBtnImg} ></Icon>
        }
        return (
            <TouchableOpacity onPress={(rowData) => { this._pressRow(rowID) }} >
                <View style={styles.rowContent}>{}
                    {iconContent}
                    <Text style={styles.rowContentCode}>{rowData.menuName}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View>
                <View style={styles.userContainer}>
                    <View style={styles.userImg}>
                        <Text style={{
                            fontSize: 60
                        }}>❌</Text>
                    </View>
                    <Text style={styles.userName}>{this.state.userName}</Text>
                </View>
                <View style={styles.menuContainer}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                    />


                </View>
                <View style={styles.menuBottom}>
                    <TouchableOpacity onPress={() => { this.props.onItemSelected('logout') }} >
                        <View style={styles.rowContent}>{}
                            <Icon name="sign-out" style={styles.backBtnImg} ></Icon>
                            <Text style={styles.rowContentCode}>注销</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    userContainer: {
        height: 180,
        backgroundColor: '#22242f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userImg: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
    },
    menuContainer: {
        height: deviceH - 180 - 55 - 20,
        backgroundColor: "#22242f",
    },
    rowContent: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
    },
    backBtnImg: {
        marginLeft: 30,
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    rowContentCode: {
        // backgroundColor: 'blue',
        paddingLeft: 10,
        fontSize: 16,
        color: 'white',
    },
    menuBottom: {
        height: 200,
        backgroundColor: '#22242f',
    }

});
