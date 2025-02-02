/*
 * @Desc: 
 * @Author: zhouhang
 * @Date: 2024-08-03 00:13:46
 */
import { Button } from "./Button";
import Success from "./Game/Success";
import { ConfigPath, Sound, StorageName, UIPath } from "./GameData";
import { Global } from "./Global";
import SdkApi from "./SDK/SdkApi";
import { SdkListen } from "./SDK/SdkListen";
import { AudioManager } from "./util/AudioUtils";
import LoadFactory, { OpenPrefabAni } from "./util/LoadFactory";
import { StorageUtils } from "./util/StorageUtils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {
    
    @property(Button)
    btn_set: Button = null;

    @property(Button)
    btn_begin: Button = null;

    @property(Button)
    btn_select: Button = null;

    @property(Button)
    btn_skin: Button = null;

    @property(cc.Label)
    txt_level: cc.Label = null;

    @property(cc.Node)
    node_showBanner: cc.Node = null;

    @property(cc.Node)
    node_hideBanner: cc.Node = null;

    @property(cc.Node)
    node_ads: cc.Node = null;


    async loadConfig() {
        const levelConfig = await LoadFactory.loadText(ConfigPath.LevelPath);
        const levelArr= levelConfig.replace(/\r\n/g, '\n').split('\n');
        Global.levelData = levelArr;
        Global.awardConfig = await LoadFactory.loadJson(ConfigPath.AwardPath);
    }


    async start() {
        if(Global.openCount == 0) {
            Global.openCount++;
            SdkListen.init();
            SdkApi.init();
            Global.playBgm = StorageUtils.getStorage(StorageName.bgmVolume) ?? true;
            Global.playEffect = StorageUtils.getStorage(StorageName.effectVolume) ?? true;
            Global.userInfo = StorageUtils.getStorageJson(StorageName.userInfo) ?? Global.userInfo;

            let date = new Date();
            let str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

            if(Global.userInfo.date != str) {
                Global.userInfo.date = str;
                Global.userInfo.lookAdsNum = 3;
                StorageUtils.setStorageJson(StorageName.userInfo, Global.userInfo);
            }
        }

        AudioManager.playBGM(Sound.loginBgm);
        Global.chooseBgm = "Login";
        this.txt_level.string = `LV ${Global.userInfo.level}`;

        Global.chooseLevel = Global.userInfo.level;

        await this.loadConfig();
        Global.game_node = this.node;
        this.initBtn();

        cc.director.preloadScene("Game");
    }
    
    initBtn() {

        this.node_ads.getComponent(Button).onTouchEnd(()=>{
            SdkApi.showReward();
        });

        this.node_hideBanner.getComponent(Button).onTouchEnd(()=>{
            SdkApi.hideBanner();
        });

        this.node_showBanner.getComponent(Button).onTouchEnd(()=>{
            SdkApi.showBanner();
        });

        this.btn_set.onTouchEnd(()=>{
            LoadFactory.loadPrefabPanel({path:UIPath.SetLayer, ani: OpenPrefabAni.Scale});
        });

        this.btn_begin.onTouchEnd(()=>{
            cc.director.loadScene("Game");
        });

        this.btn_select.onTouchEnd(()=>{
            LoadFactory.loadPrefabPanel({path: UIPath.ChooseLevelLayer});
        });

        this.btn_skin.onTouchEnd(()=>{
            console.log("打开skin",UIPath.ChooseSkinLayer);
            LoadFactory.loadPrefabPanel({path: UIPath.ChooseSkinLayer});
        });

    }

}