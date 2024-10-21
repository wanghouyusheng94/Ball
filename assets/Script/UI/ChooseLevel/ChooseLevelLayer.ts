/*
 * @Desc: 
 * @Author: zhouhang
 * @Date: 2024-08-04 12:34:19
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Button } from "../../Button";
import List from "../../Component/List/List";
import { Global } from "../../Global";
import ChooseLevelItem from "./ChooseLevelItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseLevelLayer extends cc.Component {

    
    @property(Button)
    btn_close: Button = null;

    @property(cc.Label)
    txt_gold: cc.Label = null;


    @property(List)
    list: List = null;

    start () {
        this.list.numItems = Global.levelData.length /6*5;

        this.btn_close.onTouchEnd(()=>{
            this.node.destroy();
        });
        
        this.txt_gold.string = Global.userInfo.gold.toString();

    }

    onListenRender(node: cc.Node, index: number) {
        let remain = index % 5;
        let multiple = (index - remain)/5;

        node.getComponent(ChooseLevelItem).setIndex(index,6*multiple + remain);

    }

    // update (dt) {}
}
