package com.platform_posrn;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import cn.p2shop.pos.Pos;

/**
 * Created by TonyC1 on 16/12/12.
 */

public class PangPangBridge extends ReactContextBaseJavaModule {
    public PangPangBridge(final ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PangPangBridge";
    }

    @ReactMethod
    public void login(String username, String password, Promise promise) {
        try{
            String result = Pos.call("pp:///account/login?username="+username+"&password="+password);
            promise.resolve(result);
        }
        catch(Exception e){
            e.printStackTrace();
            promise.reject("0",e.toString());
        }
    }

    @ReactMethod
    public void searchProducts(String q,int skipCount,int maxResultCount,Promise promise) {
        try{
            String result = Pos.call("pp:///catalog/search-products?q=" + q + "&skipCount=" +skipCount+ "&maxResultCount=" + maxResultCount );
            promise.resolve(result);
        }
        catch(Exception e){
            e.printStackTrace();
            promise.reject("0",e.toString());
        }
    }
}
