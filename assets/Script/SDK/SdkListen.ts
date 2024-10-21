/*
 * @Desc: 
 * @Author: zhouhang
 * @Date: 2024-07-26 09:57:02
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventUtil from "../util/EventUtils";
import GameEventType from "../util/GameEventType";

class SdkListenInstance {

    public static Instance: SdkListenInstance = new SdkListenInstance(); 

    init() {
        cc.sdk = {
            flowSdkCallback: null
        }

        //定义sdk回调
        cc.sdk.flowSDKCallback = (event, json) => {
            console.log('sdk 回调事件： ' + event)
            console.log('sdk 回调数据： ' + json)
            let jsonStr = JSON.stringify(json)
            console.log('sdk 回调数据string： ' + jsonStr)
            switch (event) {
                case 0:
                    console.log("------js初始化回调成功");
                    break;

                case 1:
                    console.log("-------js激励", json);
                    EventUtil.emit(GameEventType.SHOW_ADS);
                    break;
            }
        }

    }

    // update (dt) {}
}
export const SdkListen = SdkListenInstance.Instance;