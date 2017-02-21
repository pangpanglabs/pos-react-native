import React, { Component } from 'react';
import CatalogList from './CatalogList';
import {
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    NativeModules,
    ListView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const navigatorTitle = "Set Spot";
class SpotSet extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        this._renderRow = this._renderRow.bind(this);
    }
    componentWillMount() {

    }
    componentDidMount() {
        PangPangBridge.callAPI("/context/user", null).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs.result.spots);
            if (rs.success) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rs.result.spots),
                });
            } else {
                console.log(rs);
                alert('set spot faild')
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

            PangPangBridge.callAPI("/catalog/download", null).then((data) => {
                console.log(JSON.parse(data))
                alert("download complete");

                if (navigator) {
                    navigator.replace({
                        name: 'CatalogList',
                        component: CatalogList,
                    })
                }
            });
        } else {
            console.log(spotsResult.error);
            alert('set spot faild')
        }
    }
    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => { this._pressSpot(rowData.id) }}>
                <View style={styles.groupitem}>
                    <Text style={styles.itemText}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>);
    }
    render() {


        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
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
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 20,
            height: 40,
            justifyContent: 'center',
            flex: 1,
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
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
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
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
            marginTop: 0,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 0,
            height: 40,
            justifyContent: 'center',
            flex: 1,
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
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
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
    });
}

export default SpotSet;

