/*
 * @Desc: 
 * @Author: zhouhang
 * @Date: 2024-07-20 21:05:12
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import LoadFactory from "../util/LoadFactory";

/**
 * capacity: 容量
 * length: 总长度
 */
// 罐子里面的数据
export type TBottleData = {
    capacity: number,
    isHide: boolean,
    ballChild?: string[],
    prefabBall: cc.Prefab,
    begin: number,
    distance: number,
    height?: number,
}
/**
 * begin: 往下移动像素
 * distance: 两个球间距
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bottle extends cc.Component {

    @property(cc.Node)
    node_ballParent: cc.Node = null;

    // 碰撞动画
    @property(cc.Animation)
    ani: cc.Animation = null;

    // 结束动画
    @property(cc.Animation)
    end: cc.Animation = null;

    // 光圈动画
    @property(cc.Animation)
    aperture: cc.Animation = null;

    // 星星动画
    @property(cc.Animation)
    star: cc.Animation = null;

    // 是否已满
    private _full = false;
    private _bottleData:TBottleData = null;
    private _waitSchedule:Function = null;
    private _apertureHeight = 480;

    async init(data: TBottleData) {
        let { capacity, isHide, ballChild , prefabBall, begin, distance, height} = data;

        this._bottleData = data;
        this.node.height = height;
        this.star.node.height = height;

        this.aperture.node.y = (height - this._apertureHeight)/2;
        this.node_ballParent.height = height;
        let sprite = await LoadFactory.loadSprite(`skin/bottle/${Global.userInfo.bottleSkin}`);

        if(this?.node?.isValid) {
            this.node.getComponent(cc.Sprite).spriteFrame = sprite;
        }

        console.log("height",height);
        if(ballChild.length == 0) {
            return;
        }

        for(let i = 0;i < ballChild.length;i++) {
            let ballNode = cc.instantiate(prefabBall);
            this.node_ballParent.addChild(ballNode);
            ballNode.name = ballChild[i];   // 直接用数字做名字
            ballNode.y = begin + distance * i;

            if(isHide && i!=ballChild.length-1) {
                let spriteFrame = await LoadFactory.loadSprite(`skin/ball/${Global.userInfo.ballSkin}/doubt`);
                ballNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                ballNode.name = 'doubt';
            } else {
                let spriteFrame = await LoadFactory.loadSprite(`skin/ball/${Global.userInfo.ballSkin}/${ballChild[i]}`);
                ballNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        }
    }    

    // 显示疑问球
    async showDoubt() {
        if(this.childCount()) {
            let refreshNode = this.node_ballParent.children[this.childCount()-1];
            if(refreshNode.name != "doubt") return;
            refreshNode.name = this._bottleData.ballChild[this.childCount()-1];

            let spriteFrame = await LoadFactory.loadSprite(`skin/ball/${Global.userInfo.ballSkin}/${this._bottleData.ballChild[this.childCount()-1]}`);
            refreshNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;

            cc.tween(refreshNode)
            .set({opacity:0})
            .to(0.1,{opacity:255})
            .start();
        }
    }

    /** 容量 */
    capacity() {
        return this._bottleData.capacity;
    }

    begin() {
        return this._bottleData.begin;
    }

    distance() {
        return this._bottleData.distance;
    }

    /** 已有球数量 */
    childCount(): number {
        return this.node_ballParent.childrenCount;
    }

    height() {
        return this._bottleData.height;
    }

    /** 是否已满 */
    isFull() {
        return this._full;
    }

    topNodeName(): string {
        if(this.node_ballParent.childrenCount) {
            return this.node_ballParent.children[this.node_ballParent.childrenCount-1].name;
        } else{
            return "";
        }
    }

    check() {
        if(this.childCount() == this.capacity() && this.capacity() != 1) {
            let name = this.node_ballParent.children[0].name;
            for(let i = 1;i < this.childCount();i++) {
                if(this.node_ballParent.children[i].name != name) {
                    this._full = false;
                    return false;;
                }
            }
            this._full = true;

            console.log("结束动画播放");

            this.aperture.node.active = true;
            this.aperture.play("aperture");     // 光圈展示
            this.scheduleOnce(()=>{
                this.aperture.node.active = false;
            }, 2.8);

            this.scheduleOnce(()=>{
                this.end.node.active = true;
                this.end.play("One");   // 完结撒花
                this.scheduleOnce(()=>{
                    this.end.node.active = false;
                },1);

                this.star.node.active = true;
                this.star.play('star');
                this.scheduleOnce(()=>{
                    this.star.node.active = false;
                }, 0.75);
            }, 0.5);

            return true;
        }
        return false;
    }


    playAni(index: number) {
        console.log("播放动画");
        this.ani.node.active = true;
        this.scheduleOnce(()=>{
            this.ani.play('fireFlower');
        });
        this.ani.node.y = index*95 -10;
        

        this.unschedule(this._waitSchedule)
        this._waitSchedule = null;
        this._waitSchedule = ()=>{
            this.ani.node.active = false;
        };
        this.scheduleOnce(this._waitSchedule,0.33);
    }



    protected onDestroy(): void {
        this.unschedule(this._waitSchedule);
        this._waitSchedule = null;
    }

    ballNode() {
        return this.node_ballParent;
    }

    start() {

    }


}
