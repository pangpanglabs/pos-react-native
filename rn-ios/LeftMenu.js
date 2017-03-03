import React, { Component } from 'react';
import {
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

let tempMenuData = [
    { menuName: "销售", menuCode: "catalogList" },
    { menuName: "卖场", menuCode: "spotset" },
    // { menuName: "user", menuCode: "user" },
    // { menuName: "settings", menuCode: "settings" },
    { menuName: "注销", menuCode: "logout" },
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
        };
        this._renderRow = this._renderRow.bind(this);
    }
    _pressRow(rowID) {
        // console.log(tempMenuData[rowID].menuCode);
        // console.log(this.props.onItemSelected);
        const {onItemSelected} = this.props;
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
            <TouchableOpacity onPress={(rowData) => { this._pressRow(rowID) } } >
                <View style={styles.rowContent}>{}
                    {iconContent}
                    <Text style={styles.rowContentCode}>{rowData.menuName}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View >
                <View style={styles.naviContainer}>

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

const styles = StyleSheet.create({
    naviContainer: {
        height: 64,
        backgroundColor: '#22242f',

    },
    listView: {
        height: Dimensions.get('window').height - 64,
        backgroundColor: "#22242f",
    },
    rowContent: {
        flex: 1,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
    },
    backBtnImg: {
        marginLeft: 20,
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    rowContentCode: {
        flex: 5,
        // backgroundColor: 'blue',
        paddingLeft: 10,
        fontSize: 16,
        color: 'white',
    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: Dimensions.get('window').width / 2 - 20,
        alignSelf: 'center',
        opacity: 0.2,

    },

});
