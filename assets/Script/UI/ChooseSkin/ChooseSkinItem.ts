// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Button } from "../../Button";
import { Global } from "../../Global";
import LoadFactory from "../../util/LoadFactory";
import ChooseSkinLayer, { ESkinType } from "./ChooseSkinLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseSkinItem extends cc.Component {

    @property(cc.Node)
    node_show: cc.Node = null;

    @property(cc.Sprite)
    sp_skin: cc.Sprite = null;

    @property(cc.Node)
    node_choose: cc.Node = null;

    @property(cc.Node)
    node_hide: cc.Node = null;

    @property(cc.Label)
    txt_label: cc.Label = null;

    private _curIndex = 0;
    private _skinType = 0;
    private _parent: ChooseSkinLayer = null;

    async refreshShow(skinType: number, index: number, parent: ChooseSkinLayer) {

        this._skinType = skinType;
        this._curIndex = index;
        this._parent = parent;

        let skinName = "";
        let skinPath = "";

        let skinData: string[] = [];

        // 当前关卡解锁皮肤
        let skinLevelArr = [];

        if(skinType == 0) {
            skinName = "ball";
            skinPath = `ball/${index+1}/1`;
            skinData = Global.userInfo.unlockBall;
            skinLevelArr = [4, 22, 82, 154,251];
        } else if(skinType == 1) {
            skinName = "bottle";
            skinPath = `bottle/mini${index+1}`;
            skinData = Global.userInfo.unlockBottle;
            skinLevelArr = [10, 45, 101,182,285];
        } else {
            skinName = "bg";
            skinPath = `bg/mini${index+1}`;
            skinData = Global.userInfo.unlockBg;
            skinLevelArr = [16, 59, 125,211,301];
        }

        this.sp_skin.spriteFrame = await LoadFactory.loadSprite(`skin/${skinPath}`);

        // 已经有了
        let show = skinData.some(val=>parseInt(val) == (index+1));

        this.node_show.active = show;
        this.node_hide.active = !show;

        if(show) {
            if(Global.userInfo[`${skinName}Skin`] == (index+1)) {
                this.node_choose.active = true;
            } else {
                this.node_choose.active = false;
            }
        } else {
            if(index < 6) {
                this.txt_label.string = `LV.${skinLevelArr[index-1]}`
            } else {
                let needGold = 0;
                if(index == 6) needGold = 500;
                else needGold = 1000;
                this.txt_label.string = `$${needGold}`;
            }
        }
    }


    start () {

        this.node_show.getComponent(Button).onTouchEnd(()=>{
            if(this._skinType == 0) {
                if((this._curIndex+1).toString() == Global.userInfo.ballSkin) return;
                else {
                    Global.userInfo.ballSkin = (this._curIndex + 1).toString();
                    this._parent.refresh();
                }
            } else if(this._skinType == 1) {
                if((this._curIndex+1).toString() == Global.userInfo.bottleSkin) return;
                else {
                    Global.userInfo.bottleSkin = (this._curIndex + 1).toString();
                    this._parent.refresh();
                }
            } else {
                if((this._curIndex+1).toString() == Global.userInfo.bgSkin) return;
                else {
                    Global.userInfo.bgSkin = (this._curIndex + 1).toString();
                    this._parent.refresh();
                }
            }
        });

        this.node_hide.getComponent(Button).onTouchEnd(()=>{
            if(this._curIndex < 6) {
                LoadFactory.loadTipsPanel("Please unlock the level!");
            } else {
                let needGold = 500;
                if(this._curIndex > 6) {
                    needGold = 1000;
                }

                if(Global.userInfo.gold >= needGold) {
                    Global.userInfo.gold -= needGold;

                    let skin = (this._curIndex+1).toString();

                    if(this._skinType == 0) {
                        Global.userInfo.unlockBall.push(skin);
                    } else if(this._skinType == 1) {
                        Global.userInfo.unlockBottle.push(skin);
                    } else {
                        Global.userInfo.unlockBg.push(skin);
                    }

                    this._parent.refresh();
                    LoadFactory.loadTipsPanel("Unlocked successfully!");
                } else {
                    if(Global.isOpenAds && Global.userInfo.lookAdsNum > 0) {
                        this._parent.openPanel();
                    } else {
                        LoadFactory.loadTipsPanel(`Please collect ${needGold} gold coins!`);
                    }                    
                }
            }
        });


    }

    // update (dt) {}
}
