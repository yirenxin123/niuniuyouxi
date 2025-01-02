var BaseScene = require("BaseScene")
var MusicMgr = require('MusicMgr');
var HttpManager = require('HttpManager');
var Platform = require('Platform');
var MessageFactory = require('MessageFactory');
var GameSystem = require('GameSystem');
var SocketManager = require('SocketManager');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameCallOC = require('GameCallOC');
var AlertView = require('AlertView');

cc.Class({
    extends: BaseScene,

    properties: {
        topBg : {
            default:null,
            type:cc.Sprite
        },
        bottomBg : {
            default:null,
            type:cc.Sprite
        },
        HallBg:{
            default:null,
            type:cc.Sprite
        },
        
        Bullfight_CreateRoom : cc.Prefab,
        RoomIdEditBox : cc.EditBox,
        PopNode     : cc.Node,
        ShopView    : cc.Prefab,
        FindView    : cc.Prefab,
        SuccessView : cc.Prefab,
        MineView    : cc.Prefab,
        ClubView    : cc.Prefab,
        NoticeView  : cc.Prefab,
        ShopToggle  : cc.Toggle,
        ShareView   : cc.Prefab,
        WebView     : cc.Prefab,
        RedTips     : cc.Sprite,
        HallTitle   : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.log("HallScene.onLoad");
        GameSystem.getInstance().bLogin = true;

        GameSystem.getInstance().CurGameType = GameSystem.getInstance().GameType.GAME_TYPE_HALL;
        this.popUpNotice();
        if (!GameSystem.getInstance().bFirstInHall) {
            this.getUserDetail();   //从游戏中退出到大厅，需要刷新玩家信息
        }
        GameSystem.getInstance().bFirstInHall = false;

        this.sendCreateTableCost();
        this.sendClubUpgradeCost();
        this.sendMsgNum();

        if (GameSystem.getInstance().bReloadInGame) {
            GameSystem.getInstance().bReloadInGame = false;
            cc.log("loadScene Bullfight_GameScene");
            cc.director.loadScene('Bullfight_GameScene');
        }

    },

    start  : function () {
        this.pushRollMsg();
        if(GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined
        && GameSystem.getInstance().ledlist.length > 0)
        {
            this.schedule(this.pushRollMsg, GameSystem.getInstance().ledlist.length*10 + 10);
        }
    },

    stopRollMsg : function () {
        if(GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined
            && GameSystem.getInstance().ledlist.length > 0)
        {
            this.unschedule(this.pushRollMsg);
        }
    },
    
    pushRollMsg : function () {
        // if (this.HallTitle.string != "大熊牛友圈") {
        //     return;
        // }
        if (GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined)
        {
            for(var index = 0;index < GameSystem.getInstance().ledlist.length;index++)
            {
                var message = {
                    popView : "HallScene",
                    btn : "RollMsg",
                    data : GameSystem.getInstance().ledlist[index],
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    {tag:window.MessageType.SCENE_MSG, data:message}) ;
            }
        }
    },

    onDestroy : function () {
        this._super();
    },

    callBackBtnShare : function () {
        var ShareImagePath = GameCallOC.getInstance().screenShotAction();
        var shareView = cc.instantiate(this.ShareView);
        cc.director.getScene().addChild(shareView);
        var winSize = cc.director.getWinSize();
        shareView.setPosition(cc.p(winSize.width/2,winSize.height/2));
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE,ShareImagePath,GameSystem.getInstance().clienturl);

    },

    onSceneMsg : function (event) {
        var msg = event.data;
        if(msg.popView == "SettingView") {
            if(msg.btn == "BtnExitLogin") {
                SocketManager.getInstance().disconnect();
                cc.director.loadScene("LoadingScene");
            }
        }
        else if(msg.popView == "ProduceCell")
        {
            if(msg.btn == "callBtnBuy") {
                var WebView = cc.instantiate(this.WebView);
                this.node.addChild(WebView);
                var winSize = cc.director.getWinSize();
                WebView.setPosition(cc.p(-winSize.width,0));
                WebView.getComponent('CusWebView').setWebViewUrl(msg.url);
            }
        }
        else if(msg.popView == "FindView")
        {
            if(msg.btn == "CallBackBtn") {
                var WebView = cc.instantiate(this.WebView);
                this.node.addChild(WebView);
                var winSize = cc.director.getWinSize();
                WebView.setPosition(cc.p(-winSize.width,0));
                WebView.getComponent('CusWebView').setWebViewUrl(msg.url);
            }
        }
        else if(msg.popView == "RoomInfoView")
        {
            if(msg.btn == "BtnShare") {
                this.callBackBtnShare()
            }
        }
    },

    onMessage : function (event) {
        cc.log("HallScene.onMessage");
        this._super(event);

        var msg = event.data;
        var cmd = msg.cmd;

        switch (cmd)
        {
        case window.US_RESP_LOGIN_CMD_ID:
            this.onLoginMsg(msg);
            break;

        case window.US_RESP_CREATE_TABLE_CMD_ID:
        case window.CLUB_RESP_CREATE_TABLE_CMD_ID:
            this.onCreateRoomMsg(msg);
            break;

        case window.US_RESP_ENTER_GAME_CMD_ID:
            this.onEnterRoom(msg);
            break;

        case US_RESP_NEW_MSG_NUM_CMD_ID:
            this.showMsgTips();
            break;
        }

        if(msg.code < SocketRetCode.RET_SUCCESS) {
            LoadingView.dismiss();
        }
    },

    showMsgTips : function (msg) {
        this.RedTips.node.active = GameSystem.getInstance().NewMsgNum;
    },

    sendCreateTableCost : function () {
        var msg = MessageFactory.createMessageReq(window.US_REQ_CREATE_COST_CMD_ID);
        if (msg) {
            cc.log("HallScene.sendCreateTableCost");
            msg.send();
        } else {
            cc.log("HallScene.sendCreateTableCost not found US_REQ_CREATE_COST_CMD_ID");
        }
    },

    sendClubUpgradeCost : function () {
        var msg = MessageFactory.createMessageReq(window.US_REQ_CLUB_UPGRADE_COST_CMD_ID);
        if (msg) {
            cc.log("HallScene.sendClubUpgradeCost");
            msg.send();
        } else {
            cc.warn("HallScene.sendClubUpgradeCost not found US_REQ_CLUB_UPGRADE_COST_CMD_ID");
        }
    },

    sendMsgNum :function() {
        MessageFactory.createMessageReq(US_REQ_NEW_MSG_NUM_CMD_ID).send();
    },

    onUserDetail: function (msg) {
        cc.log("HallScene.onUserDetail");
        GamePlayer.getInstance().gold    = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
    },

    onLoginMsg : function (msg) {
        cc.log("HallScene.onLoginMsg");
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
        }
    },

    onCreateRoomMsg : function(msg)
    {
        cc.log("HallScene.onCreateRoomMsg");
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            if(msg.privateid.length > 1 )
            {
                return ;
            }
            GameSystem.getInstance().roomLevel = msg.gamelevel;
            GameSystem.getInstance().privateid = msg.privateid[0];
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;

            cc.log("onCreateRoomMsg");
            LoadingView.show("正在进入...");
            var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
            var data = {
                privateid : GameSystem.getInstance().privateid,
            };
            if(createRoom) {
                createRoom.send(data);
            }

            return;

            var self = this;
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                LoadingView.show("正在进入...");
                var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
                var data = {
                    privateid : GameSystem.getInstance().privateid,
                };
                if(createRoom) {
                    createRoom.send(data);
                }
            },"进入游戏");
            alert.setNegativeButton(function () {
                var shareView = cc.instantiate(self.ShareView);
                self.node.addChild(shareView);
                shareView.setPosition(cc.p(0,0));
                var string = "我在玩游戏［" + GameCallOC.getInstance().getAppName() +"］里创建了房间(" + GameSystem.getInstance().privateid+ "),快点一起来玩吧！！！";
                shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK,string,GameSystem.getInstance().clienturl);
            },"分享游戏");

            var string = "房间(" + GameSystem.getInstance().privateid + ")创建成功，快点分享给好友开始游戏吧";
            alert.show(string,AlertViewBtnType.E_BTN_CANCLE);
        }
    },

    onEnterRoom : function(msg)
    {
        cc.log("HallScene.onEnterRoom,tableid = " + msg.name);
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
        }
    },

    popUpNotice : function ()
    {
        if(GameSystem.getInstance().notice.doc != "")
        {
            var NoticeView = cc.instantiate(this.NoticeView);
            this.node.addChild(NoticeView);
            NoticeView.setPosition(cc.p(0,0));
            NoticeView.getComponent('NoticeView').setContent();
        }
        else{
            cc.log("HallScene.popUpNotice,undefined");
        }
    },
    
    
    /*************************************BtnCallback***************************/
    callbackBtn : function (event,CustomEventData) {
        cc.log("HallScene.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("HallScene.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(btnName == "BtnCreateRoom")
        {
            this.doBtnCreateRoom();
        }
        else if(btnName == "BtnEnterRoom")
        {
            this.doBtnEnterRoom();
        }
        else if(btnName == "Club")
        {
            this.doBtnClub();
        }
    },

    doBtnShop : function () {
        cc.log("HallScene.doBtnShop");
        this.destroyChildNode();
        this.HallTitle.string = "游戏商城";
        this.PopNode.removeAllChildren(true);
        var shopView = cc.instantiate(this.ShopView);
        this.PopNode.addChild(shopView);
        shopView.setPosition(cc.p(0,0));

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnActivity : function () {
        cc.log("HallScene.doBtnActivity");
    },

    destroyChildNode : function () {
        var children = this.PopNode.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }
        this.stopRollMsg();
    },

    doBtnFind : function () {
        cc.log("HallScene.doBtnFind");
        this.destroyChildNode();
        this.HallTitle.string = "发现";
        this.PopNode.removeAllChildren(true);
        var findView = cc.instantiate(this.FindView);
        this.PopNode.addChild(findView);
        findView.setPosition(cc.p(0,0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnSuccess : function () {
        cc.log("HallScene.doBtnSuccess");
        this.destroyChildNode();
        this.HallTitle.string = "战绩";
        this.PopNode.removeAllChildren(true);
        var successView = cc.instantiate(this.SuccessView);
        this.PopNode.addChild(successView);
        successView.setPosition(cc.p(0,0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnMine : function () {
        cc.log("HallScene.doBtnMine");
        this.destroyChildNode();
        this.HallTitle.string = "我";
        this.PopNode.removeAllChildren(true);
        var mineView = cc.instantiate(this.MineView);
        this.PopNode.addChild(mineView);
        mineView.setPosition(cc.p(0,0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnMore : function () {
        cc.log("HallScene.doBtnMore");
    },

    doBtnMain : function () {
        cc.log("HallScene.doBtnMain");
        this.destroyChildNode();
        this.PopNode.removeAllChildren(true);
        this.start();
        this.HallTitle.string = "51牛友会";
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnHead : function () {
        cc.log("HallScene.doBtnHead");
    },

    doBtnEnterRoom : function () {
        if(this.RoomIdEditBox.string == "")
        {
            ToastView.show("房间号不能为空！");
            return;
        }

        var roomId = Number(this.RoomIdEditBox.string);
        cc.log("HallScene.doBtnEnterRoom,roomId = " + roomId);
        LoadingView.show("正在进入...");
        var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid : roomId,
        };
        if(createRoom) {
            createRoom.send(data);
        }
    },

    doBtnCreateRoom : function () {
        cc.log("HallScene.doBtnCreateRoom");
        var createRoom = cc.instantiate(this.Bullfight_CreateRoom);
        this.node.addChild(createRoom);
        createRoom.getComponent('Bullfight_CreateRoom').setClubId(0,0);
        createRoom.setPosition(cc.p(0,0));
        //createRoom.getComponent('Bullfight_CreateRoom').setRoomCardView();

        var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
        if(createRoom) {
            createRoom.send();
        }
    },

    doBtnClub : function () {
        cc.log("HallScene.doBtnClub");
        this.PopNode.removeAllChildren(true);
        var clubView = cc.instantiate(this.ClubView);
        this.node.addChild(clubView);
        clubView.setPosition(cc.p(0,0));
    },
});
