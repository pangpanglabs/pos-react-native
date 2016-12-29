//
//  NativeTest.m
//  pangpangPos
//
//  Created by 李澈 on 16/12/12.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "PangPangBridge.h"
#import <Pos/Pos.h>
@implementation PangPangBridge
//导出模块
RCT_EXPORT_MODULE();    //此处不添加参数即默认为这个OC类的名字

//导出方法，桥接到js的方法返回值类型必须是void

RCT_EXPORT_METHOD(doSomething:(NSString *)name callback:(RCTResponseSenderBlock)callback)
{
  NSString* result = P2PosCall(@"pp:///account/login?username=admin&password=123qwe");
  NSLog(@"doSomething: %@",result);
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[result]);
  });
//    NSLog(@"doSomething:%@",name);
//  return result
}
RCT_EXPORT_METHOD(login:(NSString *)userName  password:(NSString *)pw
                                             resolver:(RCTPromiseResolveBlock)resolve
                                             rejecter:(RCTPromiseRejectBlock)reject)
{

  NSString *url = [NSString stringWithFormat:@"pp:///account/login?username=%@&password=%@",userName,pw];
  
  //  @"pp:///account/login?username=admin&password=123qwe"
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
//  NSError *error = [NSError errorWithDomain:@"" code:500 userInfo:nil];
//  NSString *message = @"error message";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}


RCT_EXPORT_METHOD(searchProducts:(NSString *)q  skipCount:(NSInteger )skipCount maxResultCount:(NSInteger )maxResultCount
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///catalog/search-products?q=%@&skipCount=%ld&maxResultCount=%ld",q,(long)skipCount,(long)maxResultCount];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(createCart:
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/create-cart"];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(allCart:(NSInteger)cartId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/all-cart?cartId=%ld",(long)cartId];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(getCart:(NSInteger)cartId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/get-cart?cartId=%ld",(long)cartId];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(removeCart:(NSInteger)cartId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/remove-cart?cartId=%ld",(long)cartId];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(addItem:(NSInteger)cartId skuId:(NSInteger)skuId quantity:(NSInteger)quantity
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/add-item?cartId=%ld&skuId=%ld&quantity=%ld",(long)cartId,(long)skuId,(long)quantity];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(removeItem:(NSInteger)cartId skuId:(NSInteger)skuId quantity:(NSInteger)quantity
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///cart/remove-item?cartId=%ld&skuCode=%ld&quantity=%ld",(long)cartId,(long)skuId,(long)quantity];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}

RCT_EXPORT_METHOD(placeOrder:(NSInteger)cartId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///order/place-order?cartId=%ld",(long)cartId];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(allOrders:
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///order/all-orders"];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}

RCT_EXPORT_METHOD(user:
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///context/user"];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}
RCT_EXPORT_METHOD(settings:
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSString *url = [NSString stringWithFormat:@"pp:///context/settings"];
  
  NSString* result = P2PosCall(url);
  NSLog(@"doSomething: %@",result);
  NSString *code = @"500";
  if (result) {
    resolve(result);
  } else {
    reject(code,nil,nil);
  }
}

@end
