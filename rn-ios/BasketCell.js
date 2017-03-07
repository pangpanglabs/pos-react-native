import React, { Component } from 'react';
import {
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BasketCell extends Component {
    constructor(props) {
        super(props);

    }
    static propTypes = {
        rowData: React.PropTypes.shape({
            brandCode: React.PropTypes.string.isRequired,
            contentCode: React.PropTypes.string.isRequired,
            discount: React.PropTypes.number.isRequired,
            listPrice: React.PropTypes.number.isRequired,
            name: React.PropTypes.string.isRequired,
            quantity: React.PropTypes.number.isRequired,
            salePrice: React.PropTypes.number.isRequired,
            skuCode: React.PropTypes.string.isRequired,
            uid: React.PropTypes.string.isRequired,
            unitListPrice: React.PropTypes.number.isRequired,
            unitSalePrice: React.PropTypes.number.isRequired,
        }),
        onPress: React.PropTypes.func.isRequired,
    }
    render() {
        console.log(1);
        // console.log(this.props.rowData.name);
        // let nameArr = this.props.rowData.name.split(",");
        // let nameSub = name.length > 1 ? nameArr[0] : this.props.rowData.name;
        return (
            <TouchableHighlight onPress={this.props.onPress} style={styles.rowFront} underlayColor={'#fff'}>
                <View>
                    <View style={styles.rowContent}>
                        <View style={styles.rowIcon}></View>
                        <View style={styles.rowRightContent}>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentCode}>{this.props.rowData.name}</Text>

                            </View>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentCode}>{this.props.rowData.skuCode}</Text>
                                <Text style={styles.rowContentListPrice}>¥{this.props.rowData.listPrice}</Text>

                            </View>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentCode}>9.5折</Text>
                                <Text style={styles.rowContentSalePrice}>¥{this.props.rowData.salePrice}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={styles.line}></View>

                </View>

            </TouchableHighlight>
        );
    }
}


const styles = StyleSheet.create({
    rowFront: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        // justifyContent: 'center',
        height: 80,
    },
    rowContent: {
        height: 80,
        flexDirection: 'row',
    },
    rowIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#ccc',
        margin: 10,
        marginLeft: 20,
    },
    rowRightContent: {
        flex: 1,
        height: 79,
        paddingTop: 8,
        paddingBottom: 8,
    },
    rowRightSub: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    rowContentCode: {
        overflow: 'hidden',
        height: 20,
        flex: 8,
        // backgroundColor:'blue',
        // paddingLeft: 10,
        fontSize: 16,
    },
    rowContentListPrice: {
        flex: 4,
        // backgroundColor:'green',
        paddingRight: 20,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: '600',
        textDecorationLine: 'line-through',
    },
    rowContentSalePrice: {
        flex: 4,
        // backgroundColor:'green',
        paddingRight: 20,
        fontSize: 16,
        textAlign: 'right',
        color: "red",
        fontWeight: '600',

    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: deviceW - 20,
        alignSelf: 'center',
        opacity: 0.4,

    }
});
