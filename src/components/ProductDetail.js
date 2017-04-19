import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    ScrollView,
} from 'react-native';
import { px2dp, isIOS, deviceW, deviceH } from '../../util';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qtyCount: 1,
            selectSizeKey: "",
            selectColorKey: "",
        }
        // this.displayOption = {};
        this.meetFirstConditionData = [];
        this.meetSecondConditionData = [];
        // this.newProductStyles = [];
    }
    static propTypes = {
        skusData: React.PropTypes.arrayOf(React.PropTypes.shape({
            code: React.PropTypes.string.isRequired,
            id: React.PropTypes.number.isRequired,
            images: React.PropTypes.object,
            options: React.PropTypes.array.isRequired,
            salePrice: React.PropTypes.any.isRequired,
        })),
        productStyles: React.PropTypes.shape({
            Size: React.PropTypes.array.isRequired,
            Color: React.PropTypes.array.isRequired,
        }).isRequired,
        closeModal: React.PropTypes.func.isRequired,
        openModal: React.PropTypes.func.isRequired,

    }
    initData = () => {

    }
    selectFirstCondition = (size) => {
        let skusData = this.props.skusData;
        this.meetFirstConditionData = [];
        this.meetSecondConditionData = [];
        let selectFirstCondition = size;

        skusData.map((sku) => {
            sku.options.map((obj) => {
                for (att in obj) {
                    if (obj[att] == "Size") {
                        if (obj.v == selectFirstCondition) {
                            this.meetFirstConditionData.push(sku)
                        }
                    }
                }
            })
        })
    }
    selectSecondCondition = (color) => {
        let skusData = this.props.skusData;
        this.meetSecondConditionData = [];
        let selectSecondCondition = color; //Popcorn

        this.meetFirstConditionData.map((sku) => {
            sku.options.map((obj) => {
                for (att in obj) {
                    if (obj[att] == "Color") {
                        if (obj.v == selectSecondCondition) {
                            this.meetSecondConditionData.push(sku)
                        }
                    }
                }
            })
        })
    }
    componentWillMount() {
        // this.initData();
    }

    componentDidMount() {
        this._sizeItemPress(this.props.productStyles["Size"][0]).then(() => {
            if (this.meetFirstConditionData.length > 0) {
                this._colorItemPress(this.meetFirstConditionData[0].options[1].v);
            }
        });
    }
    _pressConfirmButton = () => {
        if (this.meetSecondConditionData.length == 1 && this.state.qtyCount > 0) {
            DeviceEventEmitter.emit('addCard', this.meetSecondConditionData[0].id, this.state.qtyCount);
            this.props.closeModal();
        }
    }

    _sizeItemPress = async (size) => {
        if (this.state.selectSizeKey == size) {
            return;
        }
        // console.log("size->", size);
        await this.selectFirstCondition(size);
        // console.log(this.meetFirstConditionData);
        await this.setState({ selectSizeKey: size });
        await this.setState({ selectColorKey: "" });

    }
    _colorItemPress = async (color) => {
        if (!this._existColor(color) || this.state.selectColorKey == color) {
            return;
        }
        await this.selectSecondCondition(color);
        await this.setState({ selectColorKey: color });
        // await console.log(this.meetSecondConditionData[0].images.medium.url );

    }
    _existColor = (color) => {
        let isExist = false;
        for (let i = 0; i < this.meetFirstConditionData.length; i++) {
            if (this.meetFirstConditionData[i].options[1].v == color) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }
    render() {
        let sizeContent = this.props.productStyles["Size"].map((val) => {

            return (
                <View style={styles.sizeItem} key={val}>
                    <TouchableWithoutFeedback onPress={() => this._sizeItemPress(val)}>
                        <View style={[styles.sizeItemTop, this.state.selectSizeKey == val ? { backgroundColor: "#3e9ce9", } : {}]}>
                            <Text numberOfLines={1} style={[styles.sizeItemTopBtnText, this.state.selectSizeKey == val ? { color: "white", } : {}]}>{val}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        })

        let colorContent = this.props.productStyles["Color"].map((color) => {
            if (this._existColor(color)) {
                return (
                    <View style={styles.colorItem} key={color}>
                        <TouchableWithoutFeedback onPress={() => this._colorItemPress(color)}>
                            <View style={[styles.colorItemTop, this.state.selectColorKey == color ? { backgroundColor: "#3e9ce9", } : {}]}>
                                <Text numberOfLines={1} style={[styles.colorItemTopBtnText, this.state.selectColorKey == color ? { color: "white", } : {},]}>{color}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )
            } else {
                return (
                    <View style={styles.colorItem} key={color}>
                        <TouchableWithoutFeedback onPress={() => this._colorItemPress(color)}>
                            <View style={[styles.colorItemTop,]}>
                                <Text style={[styles.colorItemTopBtnText, { color: "#cccccc" }]}>{color}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )
            }

        })

        return (

            <View style={[styles.modalContainer]} >
                <TouchableWithoutFeedback onPress={this.props.closeModal}>
                    <View style={styles.modalBackGround}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <View style={styles.modalContentTop}>
                        <TouchableOpacity onPress={this.props.closeModal}><Ionicons style={styles.modalContentTopImg} name="md-close"></Ionicons></TouchableOpacity>
                    </View>

                    <View>
                        <View style={styles.topContainer}>
                            <View style={styles.topLeftContainer}>
                                {this.props.skusData[0].images?<Image style={styles.rowIcon} source={{ uri: this.props.skusData[0].images.medium.url }}></Image>:<Image style={styles.rowIcon}></Image>}
                                
                            </View>
                            <View style={styles.topRightContainer}>
                                <Text numberOfLines={1} style={styles.topRightText}>{this.meetSecondConditionData.length == 1 && this.meetSecondConditionData[0].name}</Text>
                                <Text style={styles.topRightText}>货号: {this.meetSecondConditionData.length == 1 && this.meetSecondConditionData[0].code}</Text>
                                <Text style={styles.topRightText}>价格: {this.meetSecondConditionData.length == 1 && this.meetSecondConditionData[0].listPrice}</Text>
                                <Text style={styles.topRightText}>已选择尺码: {this.meetSecondConditionData.length == 1 && this.meetSecondConditionData[0].options[0].v}</Text>
                                <Text style={styles.topRightText}>颜色: {this.meetSecondConditionData.length == 1 && this.meetSecondConditionData[0].options[1].v}</Text>
                            </View>
                        </View>
                        <View style={styles.line} />
                    </View>

                    <ScrollView>
                        <View style={styles.sizeContainer}>
                            <View>
                                <Text style={styles.sizeTitle}>尺码</Text>
                                <ScrollView horizontal={true} style={styles.sizeContext}>
                                    {sizeContent}
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.line} />

                        <View style={styles.colorContainer}>
                            <View>
                                <Text style={styles.colorTitle}>颜色</Text>
                                <ScrollView horizontal={true} style={styles.colorContext}>
                                    {colorContent}
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.line} />

                        <View style={styles.qtyContainer}>
                            <Text style={styles.qtyTitle}>数量</Text>
                            <View style={styles.qtyRight}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                                    this.setState({ qtyCount: this.state.qtyCount <= 0 ? 0 : this.state.qtyCount - 1 });
                                }}>
                                    <Text style={styles.btnText}>-</Text>
                                </TouchableOpacity>
                                <View style={styles.qtyCount}>
                                    <Text style={styles.qtyCountText}>{this.state.qtyCount}</Text>
                                </View>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                                    this.setState({ qtyCount: this.state.qtyCount + 1 });
                                }}>
                                    <Text style={styles.btnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.line} />
                    </ScrollView>

                    <View style={styles.confirmBtnContainer}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.confirmBtn} onPress={this._pressConfirmButton}>
                            <Text style={styles.confirmBtnText}>确定</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }
}

const modalContentHeight = px2dp(570);
const marginValue = 10;
const imageW = 130;
const topContainerH = 170;
const radiusValue = 5;


const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        width: deviceW,
        height: deviceH,
        // backgroundColor:'red',
    },
    modalBackGround: {
        width: deviceW,
        height: deviceH,
        backgroundColor: 'black',
        opacity: 0.3,
    },
    modalContent: {
        position: 'absolute',
        width: deviceW,
        height: modalContentHeight,
        marginTop: deviceH - modalContentHeight,
        backgroundColor: 'white',
        paddingBottom: isIOS ? 50 : 90,
    },
    modalContentTop: {
        width: deviceW,
        height: 30,
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContentTopImg: {
        fontSize: 30,
        color: '#3e9ce9',
        // backgroundColor:'white',
        marginLeft: marginValue,
        marginRight: marginValue,
    },
    line: {
        backgroundColor: "gray",
        height: 0.5,
        width: deviceW - marginValue * 2,
        alignSelf: 'center',
        opacity: 0.4,

    },
    topContainer: {
        width: deviceW,
        height: topContainerH,
        flexDirection: "row"
    },
    topLeftContainer: {
        // backgroundColor: "red",
        marginLeft: marginValue,
        width: imageW,
        height: topContainerH,
        // justifyContent:"center",
        // alignItems:"center",
    },
    rowIcon: {
        width: imageW,
        height: imageW,
        backgroundColor: '#ccc',
    },
    topRightContainer: {
        // backgroundColor: "yellow",
        marginLeft: marginValue,
        width: deviceW - imageW - marginValue * 2,
        height: topContainerH,
    },
    topRightText: {
        color: 'gray',
        fontSize: 16,
        // fontWeight: "500",
        lineHeight: 30,
    },


    sizeContainer: {
        width: deviceW,
        paddingHorizontal: marginValue / 2,
        // height: 100,
        // backgroundColor: "red",
        // flexDirection:"row",
    },
    sizeTitle: {
        color: 'gray',
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 30,
        marginLeft: marginValue,
        marginBottom: marginValue,
    },
    sizeContext: {
        // flexDirection: "row",
        width: deviceW,
        // justifyContent: "center",
        paddingBottom: marginValue,
    },
    sizeItem: {
        // margin: marginValue,
        width: 90,
        height: 40,
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
    sizeItemTop: {
        backgroundColor: "#efefef",
        height: 30,
        width: 80,
        borderRadius: radiusValue,
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 5,
    },
    sizeItemTopBtnText: {
        color: "#808080",
        fontWeight: "500",
        paddingHorizontal: marginValue,
        fontSize: 12,
        overflow: "hidden",
    },
    // sizeItemBottom: {
    //     textAlign: "center",
    //     color: "#7474ac",
    //     paddingHorizontal: marginValue,
    //     fontSize: 12,
    //     fontWeight: "500",
    //     overflow: "hidden",
    // },


    colorContainer: {
        width: deviceW,
        paddingHorizontal: marginValue / 2,
    },
    colorTitle: {
        color: 'gray',
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 30,
        marginLeft: marginValue,
        marginBottom: marginValue,
    },
    colorContext: {
        // flexDirection: "row",
        width: deviceW,
        // justifyContent: "center",
        paddingBottom: marginValue,

    },
    colorItem: {
        width: 110,
        height: 40,
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
    colorItemTop: {
        backgroundColor: "#efefef",
        width: 100,
        height: 30,
        borderRadius: radiusValue,
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 5,
    },
    colorItemTopBtnText: {
        paddingHorizontal: marginValue,
        color: "#808080",
        fontSize: 12,
        fontWeight: "500",
        overflow: "hidden",
        textAlign: "center",
    },




    qtyContainer: {
        width: deviceW,
        flexDirection: "row",
        height: 60,
        alignItems: "center",
    },
    qtyTitle: {
        color: 'gray',
        fontSize: 18,
        fontWeight: "500",
        width: 40,
        lineHeight: 40,
        marginLeft: marginValue,
    },
    qtyRight: {
        height: 40,
        width: deviceW - 40 - marginValue * 3,
        marginLeft: marginValue * 2,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "red",
    },
    qtyBtn: {
        width: 60,
        height: 30,
        backgroundColor: "#efefef",
        borderRadius: radiusValue,
        justifyContent: "center",
        alignItems: "center",
    },
    qtyCount: {
        width: 60,
        height: 27,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        justifyContent: "center",
        borderColor: "#efefef",
    },
    qtyCountText: {
        color: "gray",
        textAlign: "center",
        fontSize: 18,
    },
    btnText: {
        fontSize: 18,
        fontWeight: "500",
        color: "gray",
    },


    confirmBtnContainer: {
        width: deviceW,
        height: 50,
        backgroundColor: 'white',
        position: "absolute",
        bottom: isIOS ? 0 : 40,
        justifyContent: "center",
        alignItems: "center",
    },
    confirmBtn: {
        backgroundColor: "#3e9ce9",
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceW * 0.95,
        borderRadius: radiusValue,
    },
    confirmBtnText: {
        color: 'white',
        fontSize: 18,
    }
});





