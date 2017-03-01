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
  NSString* result = P2PosCall(@"pp:///v1/account/login?username=admin&password=123qwe");
  NSLog(@"doSomething: %@",result);
  dispatch_async(dispatch_get_main_queue(), ^{
    callback(@[result]);
  });
//    NSLog(@"doSomething:%@",name);
//  return result
}
RCT_EXPORT_METHOD(callAPI:(NSString *)path params:(NSDictionary *)paramsDic
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *params = @"";
  NSString *url = @"";
  if (paramsDic != nil) {
    for(id key in paramsDic) {
      //        NSLog(@"key :%@  value :%@", key, [paramsDic objectForKey:key]);
      NSString *temp = [NSString stringWithFormat:@"%@=%@&",key,[paramsDic objectForKey:key]];
      params =[params stringByAppendingString:temp];
    }
    params = [params substringToIndex:[params length] - 1];
    url = [NSString stringWithFormat:@"pp://staging%@?%@",path,params];
  }else{
    url = [NSString stringWithFormat:@"pp://staging%@",path];
  }
  
  //  @"pp:///account/login?username=admin&password=123qwe"


  @try {
    NSString* result = P2PosCall(url);
    NSLog(@"%@ :%@",path,result);
    resolve(result);
  } @catch (NSException *exception) {
    reject(@"500",[exception name],[NSError errorWithDomain:path code:500 userInfo:exception.userInfo]);
  } 
  
}

@end
