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
    NativeModules
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const navigatorTitle = "Set Spot";
class SpotSet extends Component {
    constructor(props) {
        super(props);
        this._pressSpot = this._pressSpot.bind(this);
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _pressSpot(spotId) {
        const { navigator } = this.props;

        PangPangBridge.callAPI("/account/set-spot", { spotId: spotId }).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs);
            if (rs.success) {
                AsyncStorage.setItem("spot", rs.result.token).then((aa) => {
                    if (navigator) {
                        navigator.replace({
                            name: 'CatalogList',
                            component: CatalogList,
                        })
                    }
                })
            } else {
                console.log(rs);
                alert('set spot faild')
            }
        });
    }
    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.group}>
                        <View style={styles.groupTile}>
                            <Text >Spots</Text>
                        </View>
                        <View style={styles.groupContent}>
                            <TouchableOpacity onPress={() => this._pressSpot(1)}>
                                <View style={styles.groupitem}>
                                    <Text>Spot1</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.groupLine}></View>
                            <TouchableOpacity onPress={() => this._pressSpot(2)}>
                                <View style={styles.groupitem}>
                                    <Text>Spot2</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.groupLine}></View>
                            <TouchableOpacity onPress={() => this._pressSpot(3)}>
                                <View style={styles.groupitem}>
                                    <Text>Spot3</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 5,
    },
});
export default SpotSet;

