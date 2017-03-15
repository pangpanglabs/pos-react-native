import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH } from '../util';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ProductCell extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        rowData: React.PropTypes.shape({
            images:React.PropTypes.any.isRequired,
            code: React.PropTypes.string.isRequired,
            listPrice: React.PropTypes.any.isRequired,
            name: React.PropTypes.string.isRequired,
            // salePrice: React.PropTypes.any.isRequired,
        }),
        onPress: React.PropTypes.func.isRequired,
    }
    render() {
        // let nameArr = this.props.rowData.name.split(",");
        // let nameSub = nameArr.length > 1 ? nameArr[0] : this.props.rowData.name;
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.row}>
                <View style={styles.rowContent}>
                    <Image style={styles.rowIcon} source={{uri:this.props.rowData.images.small.url}} ></Image>
                    <View style={styles.rowRightContent}>
                        <View style={styles.rowRightSub}>
                            <Text style={styles.rowContentCode}>{this.props.rowData.name}</Text>
                        </View>
                        <View style={styles.rowRightSub}>
                            <Text style={styles.rowContentCode}>{this.props.rowData.code}</Text>
                            <Text style={styles.rowContentListPrice}></Text>
                        </View>
                        <View style={styles.rowRightSub}>
                            <Text style={styles.rowContentCode}>9.5折</Text>
                            <Text style={styles.rowContentSalePrice}>¥{this.props.rowData.listPrice}</Text>
                        </View>

                    </View>
                </View>
                <View style={styles.line}></View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    row: {
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
        flex: 2,
        // backgroundColor:'green',
        paddingRight: 20,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: '600',
        textDecorationLine: 'line-through',
    },
    rowContentSalePrice: {
        flex: 5,
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


