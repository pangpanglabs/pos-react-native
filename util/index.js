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
    await AsyncStorage.getItem("dbDownload").then((data) => {
        dbDownload = data?true:false;
    });
    await AsyncStorage.getItem("spot").then((data) => {
        isSelectSpot = data?true:false;
    });
    if(!isSelectSpot) {
        alert("请选择卖场");
        return false;
    };
    if(!dbDownload) {
        alert("请同步本地数据");
        return false;
    };
    return true;
}