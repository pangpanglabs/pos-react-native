import React, { Component } from 'react';
import {
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';

let tempMenuData = [
    { menuName: "catalogList", menuCode: "catalogList" },    
    { menuName: "user", menuCode: "user" },
    { menuName: "settings", menuCode: "settings" },
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
        return (
            <TouchableOpacity onPress={(rowData) => { this._pressRow(rowID) } } >
                <View style={styles.rowContent}>
                    <Text style={styles.rowContentCode}>{rowData.menuName}</Text>
                </View>
                <View style={styles.line}></View>
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
    menuContainer: {
        flex: 1,
        marginTop: 64,
        // justifyContent: 'center',
        backgroundColor: '#3e9ce9',
    },
    naviContainer: {
        height: 64,
        backgroundColor: '#3e9ce9',

    },
    listView: {
        height: Dimensions.get('window').height - 64,
        // backgroundColor: "red",
    },
    rowContent: {
        flex: 1,
        height: 39,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
    },
    rowContentCode: {
        flex: 5,
        // backgroundColor: 'blue',
        paddingLeft: 20,
        fontSize: 16,
    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: Dimensions.get('window').width / 2 - 20,
        alignSelf: 'center',
        opacity: 0.4,

    }
});
