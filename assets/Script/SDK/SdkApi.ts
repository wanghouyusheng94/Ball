/*
 * @Desc: 
 * @Author: zhouhang
 * @Date: 2024-08-03 00:13:46
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventUtil from "../util/EventUtils";
import GameEventType from "../util/GameEventType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SdkApi {
    static androidPath: string = 'org/cocos2dx/javascript/AppActivity';
    static init() {
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            console.log("------js初始化调用")
            jsb.reflection.callStaticMethod(this.androidPath, "Init","()V")
        }
    }

    static showBanner() {
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            console.log("------js显示banner调用")
            jsb.reflection.callStaticMethod(this.androidPath, "showBanner","()V")
        }
    }

    static hideBanner() {
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            console.log("------js隐藏banner调用")
            jsb.reflection.callStaticMethod(this.androidPath, "hideBanner","()V")
        }
    }

    static preloadReward() {
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            console.log("------js预加载视频广告调用")
            jsb.reflection.callStaticMethod(this.androidPath, "preloadReward","()V")
        }
    }

    static showReward() {
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            console.log("------js显示视频广告调用")
            jsb.reflection.callStaticMethod(this.androidPath, "showReward","()V")
        } else if(cc.sys.isBrowser) {
            console.log("看广告");
            EventUtil.emit(GameEventType.SHOW_ADS);
        }
    }

}
