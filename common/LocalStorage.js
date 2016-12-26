
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export function LoadLocalStorage() {
    var tempStorage = new Storage({
        // maximum capacity, default 1000  
        size: 1000,

        // Use AsyncStorage for RN, or window.localStorage for web. 
        // If not set, data would be lost after reload. 
        storageBackend: AsyncStorage,

        // expire time, default 1 day(1000 * 3600 * 24 milliseconds). 
        // can be null, which means never expire. 
        defaultExpires: 1000 * 3600 * 24,

        // cache data in the memory. default is true. 
        enableCache: true,

        // if data was not found in storage or expired, 
        // the corresponding sync method will be invoked and return  
        // the latest data. 
        sync: {
            // we'll talk about the details later. 
        }
    });
    return tempStorage;
}
export function LoadToken(storage, cb) {
    storage.load({
        key: 'token',
        id: '1001'
    }).then(ret => {
        if (ret) {
            cb(true, ret);
        }
    }).catch(err => {
        // any exception including data not found  
        // goes to catch() 
        console.warn(err);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                cb(false, err.name);

                break;
            case 'ExpiredError':
                // TODO 
                cb(false, err.name);
                break;
        }
    });
}
export function SetToken(storage, token) {
    storage.save({
        key: "token",  // Note: Do not use underscore("_") in key! 
        id: '1001',	  // Note: Do not use underscore("_") in id!	 
        rawData: token
    });
    return true;
}




// Array.prototype.indexOf = function (val) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] == val) return i;
//     }
//     return -1;
// };
// Array.prototype.remove = function (val) {
//     var index = this.indexOf(val);
//     if (index > -1) {
//         this.splice(index, 1);
//     }
// };