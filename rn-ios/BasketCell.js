import React, { Component } from 'react';
import {
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BasketCell extends Component {
    constructor(props) {
        super(props);

    }
    static propTypes = {
        rowData: React.PropTypes.shape({
            discount: React.PropTypes.number.isRequired,
            listPrice: React.PropTypes.number.isRequired,
            quantity: React.PropTypes.number.isRequired,
            salePrice: React.PropTypes.number.isRequired,
            sku: React.PropTypes.shape({
                code:React.PropTypes.string.isRequired,
                name:React.PropTypes.string.isRequired,
                images:React.PropTypes.any.isRequired,
                
            }),
        }),
        onPress: React.PropTypes.func.isRequired,
    }
    render() {
        // console.log(this.props.rowData.name);
        // let nameArr = this.props.rowData.name.split(",");
        // let nameSub = nameArr.length > 1 ? nameArr[0] : this.props.rowData.name;
        // let styleName = nameArr[1] + (nameArr[2]);
        // console.log(styleName);
        return (
            <TouchableHighlight onPress={this.props.onPress} style={styles.rowFront} underlayColor={'#fff'}>
                <View >
                    <View style={styles.rowContent}>
                        <Image style={styles.rowIcon} source={{uri:this.props.rowData.sku.images.small.url}} ></Image>

                        <View style={styles.rowRightContent}>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentCode}>{this.props.rowData.sku.name}</Text>
                            </View>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentCode}>{this.props.rowData.sku.code}</Text>
                                <Text style={styles.rowContentListPrice}></Text>
                            </View>
                            <View style={styles.rowRightSub}>
                                <Text style={styles.rowContentSize}>styleName...</Text>
                                <Text style={styles.rowContentQty}>x{this.props.rowData.quantity}</Text>
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
        alignItems: 'center',
        backgroundColor: '#fff',
        // justifyContent: 'center',
        height: 81,
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
        marginLeft: 10,
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
        fontSize: 14,
    },
    rowContentSize: {
        overflow: 'hidden',
        height: 20,
        flex: 8,
        fontSize: 14,
        fontWeight: "600",
    },
    rowContentQty: {
        overflow: 'hidden',
        height: 20,
        flex: 5,
        fontWeight: "600",
        fontSize: 14,
    },
    rowContentListPrice: {
        flex: 4,
        // backgroundColor:'green',
        paddingRight: 10,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: '600',
        textDecorationLine: 'line-through',
    },
    rowContentSalePrice: {
        flex: 4,
        // backgroundColor:'green',
        paddingRight: 10,
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
