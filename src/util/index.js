import { Dimensions, Platform, AsyncStorage } from 'react-native'

export const deviceH = Dimensions.get('window').height
export const deviceW = Dimensions.get('window').width

const basePx = 375

export function px2dp(px) {
    return px * deviceW / basePx
}

export const isIOS = Platform.OS == "ios"



export const validateLocaStorage = async () => {
    let dbDownload = false;
    let isSelectSpot = false;
    // await AsyncStorage.getItem("dbDownload").then((data) => {
    //     dbDownload = data ? true : false;
    // });
    await AsyncStorage.getItem("spot").then((data) => {
        isSelectSpot = data ? true : false;
    });
    if (!isSelectSpot) {
        alert("请选择卖场");
        return false;
    };
    // if (!dbDownload) {
    //     alert("请同步本地数据");
    //     return false;
    // };
    return true;
}

Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

Array.prototype.each = function (fn) {
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++) {
        var res = fn.apply(this, [this[i], i].concat(args));
        if (res != null) a.push(res);
    }
    return a;
};

Array.prototype.uniquelize = function () {
    var ra = new Array();
    for (var i = 0; i < this.length; i++) {
        if (ra.indexOf(this[i]) == -1) {
            ra.push(this[i]);
        }
    }
    return ra;
};
Array.intersect = function (a, b) {
    return a.uniquelize().each(function (o) { return b.indexOf(o) > -1 ? o : null });
};  
