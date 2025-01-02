var BaseScene = require('BaseScene');
var GameSystem = require("GameSystem");
var MessageFactory = require("MessageFactory");
var GamePlayer = require('GamePlayer');
var Cmd_Bullfight = require('Cmd_Bullfight');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var AlertView = require('AlertView');
var Bullfight_Clock = require('Bullfight_Clock');
var Player = require("Player");
var Bullfight_PlayerItem = require("Bullfight_PlayerItem");
var Bullfight_CardItem = require("Bullfight_CardItem");
var Bullfight_GiftAnimation = require('Bullfight_GiftAnimation');
var MusicMgr = require('MusicMgr');
var Bullfight_AudioConfig = require('Bullfight_AudioConfig');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var UtilTool = require('UtilTool');

window.Bullfight_TableStatus = cc.Enum({
    E_TABLE_CLOSE_STATUS     : -2, //桌子关闭
    E_TABLE_NOT_START_STATUS : 0,  //桌子未开始
    E_TABLE_READY_STATUS     : 1,  //桌子准备
    E_TABLE_CALL_STATUS      : 2,  //叫庄
    E_TABLE_BET_STATUS       : 3,  //下注
    E_TABLE_OPEN_STATUS      : 4,  //开牌
    E_TABLE_OVER_STATUS      : 5,  //游戏结束
    E_TABLE_IDLE_STATUS      : 6,  //空闲
});

window.Bullfight_PlayerStatus = cc.Enum({
    E_PLAYER_UNKONW_STATUS : -2,
    E_PLAYER_WATCH_STATUS  : 0, //观察状态(可能是玩过的,也可能是没有玩过的)
    // E_PLAYER_APPLY_STATUS  : 1, //申请入座           //这2个状态废弃
    // E_PLAYER_COIN_STATUS   : 2, //向群主确认携带金币
    E_PLAYER_SIT_STATUS    : 3, //已入座,等待状态
    E_PLAYER_READY_STATUS  : 4, //玩家进入准备状态
    E_PLAYER_ACTIVE_STATUS : 5, //正在玩牌
    E_PLAYER_OVER_STATUS   : 6, //本局游戏结束
});

window.Bullfight_CallType = cc.Enum({
    E_QUIT_CALL_BANKER   : 0, //未操作
    E_NOT_CALL_BANKER    : 1, //不抢
    E_NORMAL_CALL_BANKER : 2, //抢庄
    E_SUPER_CALL_BANKER  : 3, //超级抢庄
});

cc.Class({
    extends: BaseScene,

    properties: {
        Menu            : cc.Prefab,
        MenuRoomCard    : cc.Prefab,
        CarryView       : cc.Prefab,
        PlayerItemPos   : [Bullfight_PlayerItem],
        CardItem        : [Bullfight_CardItem],
        m_iMaxPlayers   : 0,
        BtnStart        : cc.Button,
        BtnReady        : cc.Button,
        BtnCallBankerNode : cc.Node,
        BetCoinNode     : cc.Node,
        OpenCardNode    : cc.Node,
        clock           : Bullfight_Clock,
        RoomId          : cc.Label,
        RoomName        : cc.Label,
        RoundNum        : cc.Label,
        PlayersList     : cc.Prefab,
        CallBankerFlag  : [cc.Sprite],
        CallBankerFlagFrame : [cc.SpriteFrame],
        GiftAnimation   : Bullfight_GiftAnimation,
        GameTotalResult : cc.Prefab,
        ExpressionView  : cc.Prefab,
        RoomInfoView    : cc.Prefab,
        BetLabel        : [cc.Label],
        BtnMusicOn      : cc.Button,
        BtnMusicOff     : cc.Button,
        VoiceView       : cc.Prefab,
        VoicePlayView   : cc.Prefab,
        BtnVoice        : cc.Button,
        GameScene       : cc.Canvas,
        ShareView       : cc.Prefab,
        Tips            : cc.Label,
        BtnControl      : cc.Sprite,
        SuperCostLabel  : cc.Label,
        PlayNode        : cc.Node,
        DismissTableView : cc.Prefab,
        BtnRoomInfo     : cc.Button,
        BtnSuccess      : cc.Button,

        BtnBetNode : cc.Node,
        BtnBetRoomCardNode : cc.Node,
    },

    statics :{
        Instance : null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();


        GameSystem.getInstance().CurGameType = GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT;
        if (GameSystem.getInstance().EnterRoom)
        {
            MessageFactory.createMessageReq(window.US_REQ_ENTER_GAME_CMD_ID).send();
        }
        this.initData();
        this.Instance = this;
        this.updateRoomViewByLevel();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        GameCallOC.getInstance().Poll();
    },

    onDestroy : function () {
        this._super();
        this.Instance = null;
        MusicMgr.stopBackgroundMusic();
    },

    updateRoomViewByLevel : function () {
        if(GameSystem.getInstance().roomLevel == 2)
        {
            this.BtnRoomInfo.node.active = false;
            this.BtnSuccess.node.active = false;
        }
    },
    
    updateBet : function (minAnte) {
        this.BetLabel[0].string = 1*minAnte;
        this.BetLabel[1].string = 2*minAnte;
        this.BetLabel[2].string = 5*minAnte;
        this.BetLabel[3].string = 10*minAnte;
    },

    initData : function () {
        GamePlayer.getInstance().seatid = -1;
        this.tableStatus   = Bullfight_TableStatus.E_TABLE_CLOSE_STATUS;
        this.sitPlayers    = new Map();
        this.m_iMyBetCoin  = 0;
        this.m_iMaxBet     = 0;
        this.tableRuleInfo = null;
        this.bankerUid     = 0;
        this.roundnum      = 0;
        this.BetArray = [];
        this.RoomId.string = "ID:" + GameSystem.getInstance().privateid;
        this.VoiceViewNode = null;
        this.VoicePlayerViewNode = null;
        this.removeAllPlayerInTable();
        cc.log("Bullfight_GameScene.clearTable,privateid = " + GameSystem.getInstance().privateid);

        var self = this;
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_START, function(event){
            if (GamePlayer.getInstance().seatid == -1)
            {
                ToastView.show("您没有坐下不能发送语音");
                return
            }
            //显示录音界面
            self.VoiceViewNode = cc.instantiate(self.VoiceView);
            self.node.addChild(self.VoiceViewNode);
            self.VoiceViewNode.setPosition(cc.p(0,0));
        });
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_END, function(event){
            //取消录音界面
            if(self.VoiceViewNode)
            {
                self.VoiceViewNode.getComponent("VoiceView").dismiss();
                self.VoiceViewNode = null;
            }
            self.playVoiceContinue();

        });
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            //取消录音界面
            if(self.VoiceViewNode)
            {
                self.VoiceViewNode.getComponent("VoiceView").dismiss();
                self.VoiceViewNode = null;
            }
        });
        
        
        if(GameSystem.getInstance().VolumeState == 1)
        {
        	this.BtnMusicOn.node.active = false;
            this.BtnMusicOff.node.active = true;
        }
        
        this.VoiceArray = new Array();
    },

    clearTable : function () {
        this.m_iMyBetCoin = 0;
        this.m_iMaxBet    = 0;
        this.bankerUid    = 0;
        this.BtnStart.node.active = false;
        this.BtnReady.node.active = false;
        this.clock.node.active    = false;
        this.BtnCallBankerNode.active = false;
        //this.BetCoinNode.active = false;
        if(GameSystem.getInstance().roomLevel == 2)
        {
            this.BtnBetRoomCardNode.active = false;
        }
        else
        {
            this.BtnBetNode.active = false;
        }

        this.OpenCardNode.active = false;
        this.BetArray = [];
        this.clearCallBankerFlag();
    },

    /*********************Network***************************/
    callBackBtnShare : function () {

        var ShareImagePath = GameCallOC.getInstance().screenShotAction();
        var shareView = cc.instantiate(this.ShareView);
        this.node.addChild(shareView);
        shareView.setPosition(cc.p(0,0));
        var string = "游戏结算分享";
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE,ShareImagePath,GameSystem.getInstance().clienturl);

    },

    playVoiceContinue : function () {
        if (this.VoicePlayerViewNode != null) {
            cc.log("this.VoicePlayerViewNode  removeFromParent");
            this.VoicePlayerViewNode.removeFromParent(true);
            this.VoicePlayerViewNode = null;
        }
        var msg = this.VoiceArray.pop();
        cc.log("onSceneMsg,msg = " + JSON.stringify(msg));
        if(msg) {
            var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
            if(this.VoicePlayerViewNode == null && this.VoiceViewNode == null) {
                cc.log("this.VoicePlayerViewNode  create1");
                this.VoicePlayerViewNode = cc.instantiate(this.VoicePlayView);
                this.GiftAnimation.node.addChild(this.VoicePlayerViewNode);
                this.VoicePlayerViewNode.setPosition(this.CallBankerFlag[fromViewId].node.position);
                var text = JSON.parse(BASE64.decoder(msg.text));
                GameCallOC.getInstance().DownloadRecordedFile(text.fileID,text.filePath);
            }
        }
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        cc.log("onSceneMsg,msg.popView = " + msg.popView);
        if (msg.popView == "GloudVoice") {
            if (msg.btn == "OnPlayRecordedFile") {
                this.playVoiceContinue();
            }
        } else if (msg.popView == "Bullfight_TotalResult") {
            if (msg.btn == "BtnShare") {
                this.callBackBtnShare();
            }
        } else if (msg.popView == "Bullfight_Menu") {
            if (msg.btn == "BtnShare") {
                this.showShareView();
                //this.callBackBtnShare();
            }
        } else if(msg.popView == "VoicePlayView")
        {
            if(msg.btn = "dismiss")
            {
                cc.log("this.VoicePlayerViewNode  null");
                this.VoicePlayerViewNode = null;
            }

        }
    },

    onMessage : function (event) {
        cc.log("Bullfight_GameScene.onMessage");
        this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd)
        {
            case window.US_RESP_LOGIN_CMD_ID:
                this.onLoginMsg(msg);
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                this.onEnterRoom(msg);
                break;

            case window.US_RESP_SIT_DOWN_CMD_ID:
                this.onSitDown(msg);
                break;

            case window.US_RESP_LEAVE_GAME_CMD_ID:
                this.onLeaveGame(msg);
                break;

            case window.US_NOTIFY_GAME_SWITCH_CMD_ID:
                this.onNotifyGameSwitch(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_READY_CMD_ID:
                this.onReady(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID:
                this.onNotifyGameStart(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID:
                this.onCallBanker(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID:
                this.onNotifySureBanker(msg);
                break;

            case window.US_RESP_GAME_SWITCH_CMD_ID:
                this.onGameSwitch(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID:
                this.onBetCoin(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID:
                this.onNotifyOpenCard(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID:
                this.onOpenCard(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID:
                this.onNotifyOneGameResult(msg);
                break;

            case window.US_RESP_CARRY_COIN_CMD_ID:
                this.onCarryCoin(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID:
                this.doKickOut(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID:
                this.onNotifyNotCallbanker(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID:
                this.onNotifyNotBet(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID:
                this.NotifyTotalGameResult(msg);
                break;

            case Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID:
                this.onGetTableDetail(msg);
                break;

            case US_RESP_GAME_CHAT_CMD_ID:
                this.onChatMsg(msg);
                break;

            case window.US_RSP_DISMISS_TABLE_CMD_ID:
                this.onDismissTable(msg);
                break;
            case window.US_NOTIFY_DISMISS_TABLE_CMD_ID:
                this.onNotifyDismissTable(msg);
                break;
        };
    },

    onNotifyDismissTable: function (msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("onNotifyDismissTable dismissuid=", msg.dismissuid, " name=", msg.name, " timeout=", msg.timeout);
            var DismissTable = cc.instantiate(this.DismissTableView);
            this.node.addChild(DismissTable);
            DismissTable.setPosition(cc.p(0,0));
            DismissTable.getComponent("Bullfight_DismissTable").setSendInfo(msg.name, msg.dismissuid, msg.timeout);
        }
    },

    onDismissTable : function (msg) {
        if(msg.code != SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    onChatMsg : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            if(msg.kind == ChatType.E_CHAT_FACE_KIND) {
                var viewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                var pos    = this.CallBankerFlag[viewId].node.position;
                this.GiftAnimation.playFaceAnimation(msg.type, pos);
            } else if(msg.kind == ChatType.E_CHAT_GIFT_KIND) {
                var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                var toViewId   = this.getPlayerViewIdBySeatId(this.findPlayer(msg.touid).seatid);
                var start      = this.PlayerItemPos[fromViewId].node.position;
                var end        = this.PlayerItemPos[toViewId].node.position;
                this.GiftAnimation.playGiftAnimation(msg.type, start,end);
            } else if(msg.kind == ChatType.E_CHAT_VOICE_KIND) {
                var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                if(this.VoicePlayerViewNode == null && this.VoiceViewNode == null) {
                    cc.log("this.VoicePlayerViewNode  create");
                    this.VoicePlayerViewNode = cc.instantiate(this.VoicePlayView);
                    this.GiftAnimation.node.addChild(this.VoicePlayerViewNode);
                    this.VoicePlayerViewNode.setPosition(this.CallBankerFlag[fromViewId].node.position);
                    var text = JSON.parse(BASE64.decoder(msg.text));
                    cc.log("Bullfight_GameScene.onChatMsg,fileID = " + text.fileID);
                    cc.log("Bullfight_GameScene.onChatMsg,downloadFilePath = " + text.filePath);
                    GameCallOC.getInstance().DownloadRecordedFile(text.fileID,text.filePath);
                } else {
                    //语音一次只能播放一个，如果当前有播放的先保存，等播放玩了继续播放
                    cc.log("onChatMsg,msg = " + JSON.stringify(msg));
                    this.VoiceArray.push(msg);
                    cc.log("onChatMsg,VoiceArray = " + this.VoiceArray.length);
                }
            } else if(msg.kind == ChatType.E_CHAT_WORD_KIND) {

            }
        } else {

        }
    },

    onLoginMsg : function (msg) {
        cc.log("Bullfight_GameScene.onLoginMsg");
        if (msg.code >= SocketRetCode.RET_SUCCESS) {
            this.clearTable();
            this.delAllPlayer();
            MessageFactory.createMessageReq(Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID).send();
        }
    },

    showShareView : function () {
        var shareView = cc.instantiate(this.ShareView);
        this.node.addChild(shareView);
        shareView.setPosition(cc.p(0,0));
        var string = "我在游戏［" + GameCallOC.getInstance().getAppName() +"］里创建了房间(" + GameSystem.getInstance().privateid+ "),快点一起来玩吧！！！";
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK,string,GameSystem.getInstance().clienturl);
    },

    onEnterRoom : function (msg) {
        cc.log("Bullfight_GameScene.onEnterRoom");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableRuleInfo   = JSON.parse(BASE64.decoder(msg.param));
            this.tableStatus     = msg.tstatus;
            this.m_iMaxPlayers   = msg.seats;
            this.RoomName.string = msg.name;
            GamePlayer.getInstance().bowner    = msg.bowner;
            GamePlayer.getInstance().status    = msg.ustatus;
            GameSystem.getInstance().superCost = msg.supercost;
            GameSystem.getInstance().giftCost  = msg.giftcosts;
            this.SuperCostLabel.string = GameSystem.getInstance().superCost;
            this.updateBet(this.tableRuleInfo.minante);

            // if (msg.bowner == 1) {
            //     this.BtnControl.node.active = true
            // } else {
            //     this.BtnControl.node.active = false
            // }

            cc.log("onEnterRoom: tstatus=", this.tableStatus, " status=", GamePlayer.getInstance().status);

            //本局游戏没有开始，并且自己是桌主
            if ((this.tableStatus == Bullfight_TableStatus.E_TABLE_NOT_START_STATUS) && GamePlayer.getInstance().bowner == 1) {
                cc.log("onEnterRoom: bowner=" + GamePlayer.getInstance().bowner);
                this.showTableStatusBtn(); //显示游戏开始按钮
                if(GameSystem.getInstance().VerStatus != GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT)
                {
                    this.showShareView();
                }

            } else if (this.tableStatus > Bullfight_TableStatus.E_TABLE_NOT_START_STATUS) {
                cc.log("Bullfight_GameScene.onEnterRoom, get table detail.");
                MessageFactory.createMessageReq(Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID).send();

                switch (this.tableStatus) {
                    case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                        this.Tips.string = "准备中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                        this.Tips.string = "抢庄中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_BET_STATUS:
                        this.Tips.string = "下注中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                        this.Tips.string = "开牌中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                        this.Tips.string = "本局结束";
                        break;
                }
            } else {
                this.Tips.string = "游戏未开始";
            }

            //显示在自己之前进入的玩家
            for (var index = 0; msg.seaters != null && index < msg.seaters.length;index++) {
                var player        = new Player;
                player.uid        = msg.seaters[index].uid;
                player.name       = msg.seaters[index].name;
                player.headurl    = msg.seaters[index].headurl;
                player.sex        = msg.seaters[index].sex;
                player.gold       = msg.seaters[index].gold;
                player.diamond    = msg.seaters[index].diamond;
                player.coin       = msg.seaters[index].coin;
                player.seatid     = msg.seaters[index].seatid;
                player.status     = msg.seaters[index].status;
                player.winGold    = msg.seaters[index].win;
                player.TotalCarry = msg.seaters[index].total;
                player.TotalRound = msg.seaters[index].totalround; //总手数
                player.TotalTable = msg.seaters[index].totaltable; //总局数
                this.addPlayer(player);
            }
            this.refreshAllPlayerOnTable(false);

            if (GamePlayer.getInstance().seatid == -1) {
                this.SitDown();
            }

        }
    },

    SitDown: function () {
        var data = {
            status : 1,
        };
        MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
        MusicMgr.playEffect(Audio_Common.AUDIO_SIT);
    },

    onSitDown : function (msg) {
        cc.log("Bullfight_GameScene.onSitDown");
        LoadingView.dismiss();
        if(msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;
            if (msg.switch == 1) {
                var player = new Player();
                cc.log("player.seatid = " + msg.seatid);
                player.uid        = msg.seatuid;
                player.name       = msg.name;
                player.headurl    = msg.headurl;
                player.sex        = msg.sex;
                player.gold       = msg.gold;
                player.diamond    = msg.diamond;
                player.coin       = msg.coin;
                player.status     = msg.status;
                player.seatid     = msg.seatid;
                player.winGold    = msg.win;
                player.TotalCarry = msg.total;
                player.TotalRound = msg.totalround; //总手数
                player.TotalTable = msg.totaltable; //总局数
                cc.log("onSitDown player.TotalRound=", player.TotalRound, " player.TotalTable=", player.TotalTable)
                this.addPlayer(player);

                if (player.uid == GamePlayer.getInstance().uid) {
                    this.refreshAllPlayerOnTable(true);
                } else {
                    this.showOnePlayerInTable(player);
                }

                if (msg.seatuid == GamePlayer.getInstance().uid) {
                    if (msg.iscarry > 0) { //需要携带金币
                        this.createCarryView(msg.carrytime);
                    } else {
                        this.showTableStatusBtn();
                    }
                }
            } else {
                this.delPlayer(msg.seatuid);
                if (msg.seatuid == GamePlayer.getInstance().uid) { //如果是自己，则需要清理按键
                    this.refreshAllPlayerOnTable(true);
                    this.showTableStatusBtn();
                }
            }
        } else if(msg.code > SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    onCarryCoin : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("[%d,%d]", msg.carryuid, GamePlayer.getInstance().uid);
            this.tableStatus = msg.tstatus;
            if (GamePlayer.getInstance().bowner != 1 && msg.carryuid == GamePlayer.getInstance().uid) {
                ToastView.show("桌主已同意您的请求");
            }

            var player = this.findPlayer(msg.carryuid);
            if (player) {
                cc.log("Bullfight_GameScene.onCarryCoin,carrycoin = " + msg.carrycoin, " coin=", msg.coin);
                player.status     = msg.ustatus;
                player.TotalCarry = msg.carrycoin;
                player.coin       = msg.coin;
                player.gold       = msg.gold;
                player.diamond    = msg.diamond;
                var viewid = this.getPlayerViewIdBySeatId(player.seatid);
                this.PlayerItemPos[viewid].setUserGold(player.coin);
            }

            if (msg.carryuid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().status = msg.ustatus;
                this.showTableStatusBtn();
            }
        } else {
            ToastView.show(msg.desc);
        }
    },

    onLeaveGame : function (msg) {
        cc.log("Bullfight_GameScene.onLeaveGame");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GameSystem.getInstance().gamesvcid = 0;
            GameSystem.getInstance().tableid   = 0;
            cc.director.loadScene('HallScene');
        }
    },

    onNotifyGameSwitch : function (msg) {
        cc.log("Bullfight_GameScene.onNotifyGameSwitch");
        if (msg.isStart == 1)  {
            this.tableStatus                = msg.tstatus;
            GamePlayer.getInstance().status = msg.ustatus;

            cc.log("Bullfight_GameScene.onNotifyGameSwitch,this.tableStatus = " + this.tableStatus);

            this.showTableStatusBtn();

            if (this.sitPlayers.size() > 0 ) {
                this.startClockTime(msg.readyTime);
                this.Tips.string = "准备中";
            } else {
                this.Tips.string = "请入座";
            }

            this.clearAllPlayerCardItem();
            this.clearCallBankerFlag();
            this.clearUserWinScore();
            this.clearUserHeadBanker();
        }
        else
        {
            //弹框提示玩家游戏解散
            ToastView.show(msg.desc);
        }
    },

    onNotifyGameStart : function (msg) {
        cc.log("Bullfight_GameScene.onNotifyGameStart");

        this.clearReadyFlag();
        GamePlayer.getInstance().status = msg.ustatus;
        this.tableStatus = msg.tstatus;
        this.roundnum = msg.roundnum;
        this.RoundNum.string = "第" + this.roundnum + "局";
        this.Tips.string     = "抢庄中";

        this.startClockTime(msg.calltime);

        //在座位上
        if (GamePlayer.getInstance().seatid >= 0) {
            if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
                this.sendCardsToPlayer(viewId, msg.cards);
            }
        }

        this.showTableStatusBtn();

        //其他玩家
        // Uid     uint32 `json:"uid"`
        // UStatus int    `json:"ustatus"`
        // SeatId  int    `json:"seatid"`
        for (var index = 0;index < msg.seaters.length; index++) {
            var item = msg.seaters[index];

            var player = this.findPlayer(item.uid);
            player.status = item.ustatus;
            player.finalcoin  = 0;
            player.bulltype   = 0;
            player.cards      = [];
            player.calltype   = 0;  //叫庄类型
            player.bBanker    = 0;  //是否是庄家
            player.betcoinmul = 0;  //下注倍数
            player.bOpenCard  = 0;  //是否看牌

            if (item.ustatus == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                var viewId = this.getPlayerViewIdBySeatId(item.seatid);
                var cards = [0,0,0,0,0];
                this.sendCardsToPlayer(viewId, cards);
            } else {
                //旁观
                this.refreshLookFlag(item.uid);
            }
        }
    },

    onReady : function(msg) {
        cc.log("Bullfight_GameScene.onReady readuid=", msg.readyuid, " ustatus=", msg.ustatus);
        if(msg.code == SocketRetCode.RET_SUCCESS) {

            if (msg.readyuid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().status = msg.ustatus;
                this.BtnReady.node.active = false;
                this.clearTable();
                this.Tips.string = "等待其他玩家准备";
            }

            this.updatePlayerStatus(msg.readyuid, msg.ustatus);

            this.refreshReadyFlag(msg.readyuid);
        }
    },

    onCallBanker : function (msg) {
        cc.log("Bullfight_GameScene.onCallBanker");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;
            if (msg.calluid == GamePlayer.getInstance().uid)
            {
                this.BtnCallBankerNode.active = false;
                this.Tips.string = "等带其他玩家抢庄";
            }

            this.updatePlayerCallType(msg.calluid, msg.calltype);
            this.refreshCallBankerFlag(msg.calluid, true);
        } else {
            ToastView.show(msg.desc);
        }
    },

    onNotifySureBanker : function (msg) {
        cc.log("Bullfight_GameScene.onNotifySureBanker");
        this.clearCallBankerFlag();
        this.startClockTime(msg.bettime);
        this.bankerUid   = msg.bankeruid;
        this.m_iMaxBet   = msg.maxbetmul;
        this.tableStatus = msg.tstatus;
        GamePlayer.getInstance().status = msg.ustatus;

        var player = this.findPlayer(msg.bankeruid);
        player.bBanker = 1;
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        this.PlayerItemPos[viewId].setPlayerBanker();

        this.showTableStatusBtn();
        this.Tips.string = "下注中";
    },

    onGameSwitch : function (msg) {
        cc.log("Bullfight_GameScene.onGameSwitch");
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            if (msg.isstart == 1)
            {
                this.BtnStart.node.active = false;
                this.Tips.string = "游戏开始";
            }
            else
            {
                ToastView.show("房间解散成功，本局结束后将解散");
            }
        } else if (msg.code == 14) {
            ToastView.show(msg.desc);
        }
    },

    onBetCoin : function (msg) {
        cc.log("Bullfight_GameScene.onBetCoin");
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            this.tableStatus                = msg.tstatus;
            GamePlayer.getInstance().status = msg.ustatus;

            if ((msg.betuid == GamePlayer.getInstance().uid) &&
                (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS))
            {
                //this.BetCoinNode.active = false;
                if(GameSystem.getInstance().roomLevel == 2)
                {
                    this.BtnBetRoomCardNode.active = false;
                }
                else
                {
                    this.BtnBetNode.active = false;
                }
                this.Tips.string = "等待其他玩家下注";
            }
            var player = this.sitPlayers.get(msg.betuid);
            player.betcoinmul = msg.betcoinmul;
            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
        }
    },

    onNotifyOpenCard : function (msg)
    {
        cc.log("onNotifyOpenCard...");
        GamePlayer.getInstance().status = msg.ustatus;
        this.tableStatus = msg.tstatus;
        this.startClockTime(msg.opentime);
        this.Tips.string = "看牌中";

        if (GamePlayer.getInstance().status != Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS)
            return;

        GamePlayer.getInstance().cards = msg.cards;
        var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
        cc.log("Bullfight_GameScene.onNotifyOpenCard,viewId = " + viewId);
        this.openplayerCards(viewId, msg.cards, -1, -1);
        this.showTableStatusBtn();
        this.setCustomCardType(true);
    },

    onOpenCard : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;

            var player = this.findPlayer(msg.openuid);
            player.bulltype  = msg.bulltype;
            player.cards     = msg.cards;
            player.bOpenCard = 1;
            cc.log("Bullfight_GameScene.onOpenCard,player = " + player);
            var viewId = this.getPlayerViewIdBySeatId(msg.seatid);
            this.setCardType(viewId, player.bulltype, true);
            this.openplayerCards(viewId, player.cards, msg.index1, msg.index2);

            if (msg.openuid == GamePlayer.getInstance().uid) {
                this.setCustomCardType(false);
                this.OpenCardNode.active = false;
                this.Tips.string = "等待其他玩家看牌";
            }
        }
    },

    onNotifyOneGameResult : function (msg) {
        this.tableStatus                = msg.tstatus;
        GamePlayer.getInstance().status = msg.ustatus;

        cc.log("onNotifyOneGameResult msg.ustatus=", msg.ustatus, " status=", GamePlayer.getInstance().status);

        this.OpenCardNode.active = false;
        this.setCustomCardType(false);
        // this.clearAllPlayerCardItem();
        // this.showTableStatusBtn();
        // this.clearCallBankerFlag();
        this.startClockTime(msg.overtime);
        this.Tips.string = "本局结算";

        for (var index = 0;index < msg.seaters.length;index++) {
            if (msg.seaters[index].ustatus == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS) {
                var player = this.findPlayer(msg.seaters[index].uid);
                player.status = msg.seaters[index].ustatus;
                player.coin   = msg.seaters[index].coin;

                var viewid = this.getPlayerViewIdBySeatId(msg.seaters[index].seatid);
                this.PlayerItemPos[viewid].setUserWinScore(msg.seaters[index].finalcoin);
                this.PlayerItemPos[viewid].setUserGold(msg.seaters[index].coin);

                if (msg.seaters[index].uid == GamePlayer.getInstance().uid) {
                    if (msg.seaters[index].finalcoin > 0)
                    {
                        var pos = this.CallBankerFlag[viewid].node.position;
                        this.GiftAnimation.playWinAnimation(pos);

                        MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_WIN);
                    } else {
                        MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_LOSE);
                    }
                }
            }
        }
    },

    doKickOut : function (msg) {
        if (msg.code != SocketRetCode.RET_SUCCESS) //选择携带金币超时
        {
            this.delPlayer(msg.seatuid);
            cc.log("Bullfight_GameScene.doKickOut,uid = " + GamePlayer.getInstance().uid);
            if (msg.seatuid == GamePlayer.getInstance().uid) {
                cc.log("Bullfight_GameScene.doKickOut, my be kickout.");
                GamePlayer.getInstance().status = 0;
                GamePlayer.getInstance().seatid = -1;
                this.refreshAllPlayerOnTable(true);
                this.showTableStatusBtn();
                if (msg.code != SocketRetCode.RET_SUCCESS) {
                    ToastView.show(msg.desc);
                }

            }
        }
    },

    onNotifyNotCallbanker : function (msg) {
        
    },

    onNotifyNotBet : function (msg) {
        
    },

    NotifyTotalGameResult : function (msg) {
        this.createTotalGameResult(msg);
    },
    
    createTotalGameResult : function (msg) {
        var gameEnd = cc.instantiate(this.GameTotalResult);
        this.node.addChild(gameEnd);
        gameEnd.setPosition(cc.p(0,0));
        gameEnd.getComponent("Bullfight_TotalResult").setGameData(msg,this.GameScene);
    },
    
    onGetTableDetail : function (msg) {
        if(msg.code < SocketRetCode.RET_SUCCESS)
            return ;

        this.tableRuleInfo = {
            gametype   : msg.gametype,
            minante    : msg.minante,
            mincarry   : msg.mincarry,
            maxcarry   : msg.maxcarry,
            livetime   : msg.livetime,
            seats      : msg.seats,
            bullmul    : msg.bullmul,
            totalcarry : msg.totalcarry,
        };

        cc.log("onGetTableDetail mincarry=", msg.minmincarry, " maxcarry=", msg.maxcarry);

        this.roundnum = msg.roundnum;
        this.RoundNum.string = "第" + this.roundnum + "局";
        GameSystem.getInstance().privateid = msg.privateid;
        this.RoomId.string   = "ID:" + GameSystem.getInstance().privateid ;

        cc.log("onGetTableDetail roundnum=", this.roundnum, " privateid=", GameSystem.getInstance().privateid);

        GamePlayer.getInstance().TotalCarry = msg.carrycoin;
        GamePlayer.getInstance().bowner     = msg.bowner;

        // if (msg.bowner == 1) {
        //     this.BtnControl.node.active = true
        // } else {
        //     this.BtnControl.node.active = false
        // }

        this.m_iMaxPlayers = msg.seats;
        this.tableStatus   = msg.tstatus;
        this.bankerUid     = msg.bankeruid;
        this.updateClockTime(msg.timeout);

        for(var index = 0;index < msg.seaters.length;index++)
        {
            var player        = new Player;
            player.uid        = msg.seaters[index].uid;
            player.name       = msg.seaters[index].name;
            player.headurl    = msg.seaters[index].headurl;
            player.sex        = msg.seaters[index].sex;
            player.gold       = msg.seaters[index].gold;
            player.diamond    = msg.seaters[index].diamond;
            player.coin       = msg.seaters[index].coin;
            player.status     = msg.seaters[index].status;
            player.seatid     = msg.seaters[index].seatid;
            player.TotalCarry = msg.seaters[index].total;
            player.winGold    = msg.seaters[index].win;
            player.calltype   = msg.seaters[index].calltype;
            player.betcoinmul = msg.seaters[index].betmul;
            player.cards      = msg.seaters[index].cards;
            player.bulltype   = msg.seaters[index].bulltype;
            player.finalcoin  = msg.seaters[index].finalcoin;
            player.TotalRound = msg.seaters[index].totalround; //总手数
            player.TotalTable = msg.seaters[index].totaltable; //总局数
            player.bOpenCard  = msg.seaters[index].bopencard;  //

            if (player.uid == GamePlayer.getInstance().uid) {
                this.m_iMaxBet   = msg.seaters[index].maxbetmul;
            }

            if (this.bankerUid == player.uid) {
                player.bBanker = 1;
            } else {
                player.bBanker = 0;
            }
            cc.log("onGetTableDetail uid=", player.uid, " isbanker=", player.bBanker);

            this.addPlayer(player);
        }
        this.refreshAllPlayerOnTable(true);
    },

    /***********send Message ********************/

    sendReady : function () {
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_READY_CMD_ID).send();
    },

    sendCallBanker : function (callType) {
        var data = {
            calltype : callType,
        };
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID).send(data);
    },
    
    sendSwitchGame : function (isStart) {
        var data = {
            isstart : isStart,
        };
        MessageFactory.createMessageReq(US_REQ_GAME_SWITCH_CMD_ID).send(data);
    },

    sendBetCoinReq : function (betcoin) {
        var data = {
            betcoinmul : this.m_iMyBetCoin,
        };
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID).send(data);
    },
    
    sendOpenCard : function () {
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID).send();
    },
    
    /***********************BtnCallback*************************/

    callbackBtnMusic : function (toggle,CustomEventData) {
        var isCheck = toggle.isChecked;
        if (isCheck)
        {
            MusicMgr.resumeBackgroundMusic();
        }
        else
        {
            MusicMgr.pauseBackgroundMusic();
        }
    },
    
    callBackBetBtnRoomCard : function (event,CustomEventData) {
        var node = event.target;
        var btn = node.getName();


        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);


        cc.log("Bullfight_GameScene.callBackBetBtnRoomCard,btn = " + btn);

        if(btn == "BtnBet1")
        {
            this.m_iMyBetCoin = 1;
            cc.log("[BtnBet1] m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        }
        else if(btn == "BtnBet3")
        {
            this.m_iMyBetCoin = 3;
            cc.log("[BtnBet2] m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        }
        else if(btn == "BtnBet5")
        {
            this.m_iMyBetCoin = 5;
            this.BetArray.push(5);
            cc.log("[BtnBet5]  m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        }
    },

    callbackBtn : function (event,CustomEventData) {
        var node = event.target;
        var btn = node.getName();
        

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        
        
        cc.log("Bullfight_GameScene.callbackBtn,btn = " + btn);

        if (btn == "BtnMenu")
        {
            this.createMenu();
        }
        else if (btn == "BtnSuccess")
        {
            var playerList = cc.instantiate(this.PlayersList);
            this.node.addChild(playerList);
            playerList.setPosition(cc.p(0,0));
        }
        else if (btn == "BtnSpeech")
        {
            //this.createTotalGameResult();
            //this.GiftAnimation.playGiftAnimation(1);
        }
        else if (btn == "BtnMusicOn")
        {
            this.BtnMusicOff.node.active = true;
            this.BtnMusicOn.node.active = false;
            
            GameSystem.getInstance().VolumeState = 1;
            
            MusicMgr.pauseBackgroundMusic();
        }
        else if (btn == "BtnMusicOff")
        {
            this.BtnMusicOff.node.active = false;
            this.BtnMusicOn.node.active = true;
            
            GameSystem.getInstance().VolumeState = 0;
            
            MusicMgr.resumeBackgroundMusic();
        }
        else if(btn == "BtnStart")
        {
            this.sendSwitchGame(1);
        }
        else if(btn == "BtnReady")
        {
            this.sendReady();
        }
        else if(btn == "BtnNotCall")
        {
            this.sendCallBanker(1);
        }
        else if(btn == "BtnCall")
        {
            this.sendCallBanker(2);
        }
        else if(btn == "BtnSuperCall")
        {
            this.sendCallBanker(3);
        }
        else if(btn == "BtnBet1")
        {
            this.m_iMyBetCoin += 1;
            this.BetArray.push(1);
            cc.log("[BtnBet1] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        }
        else if(btn == "BtnBet2")
        {
            this.m_iMyBetCoin += 2;
            this.BetArray.push(2);
            cc.log("[BtnBet2] this.BetArray = ", this.BetArray,  " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        }
        else if(btn == "BtnBet5")
        {
            this.m_iMyBetCoin +=5;
            this.BetArray.push(5);
            cc.log("[BtnBet5] this.BetArray = ", this.BetArray,  " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        }
        else if(btn == "BtnBet10")
        {
            this.m_iMyBetCoin += 10;
            this.BetArray.push(10);
            cc.log("[BtnBet10] this.BetArray = ", this.BetArray,  " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        }
        else if(btn == "BtnBetSure")
        {
            this.sendBetCoinReq();
        }
        else if(btn == "BtnBetCancle")
        {
            if (this.BetArray.length > 0) {
                var bet = this.BetArray.pop();
                this.m_iMyBetCoin -= bet;
                cc.log("[BtnBetCancle] this.BetArray = ", this.BetArray,  " m_iMyBetCoin=", this.m_iMyBetCoin, " bet=" + bet);
                if (this.m_iMyBetCoin <= 0) {
                    this.m_iMyBetCoin = 1;
                }
                this.updateMaxBet();
            } else {
                cc.warn("[BtnBetCancle] not this.BetArray = ", this.BetArray,  " m_iMyBetCoin=", this.m_iMyBetCoin);
            }
        }
        else if(btn == "BtnNoBullfight")
        {
            this.sendOpenCard();
        }
        else if(btn == "BtnBullfight")
        {
            this.sendOpenCard();
        }
        else if(btn == "BtnExpression")
        {
            this.createExpression();
        }
        else if(btn == "BtnRoomInfo")
        {
            this.createRoomInfoView();
        }
    },

    createExpression : function () {
        var ExpressionView = cc.instantiate(this.ExpressionView);
        this.node.addChild(ExpressionView);
        ExpressionView.setPosition(cc.p(0,0));
    },

    updateMaxBet : function () {
        if (this.m_iMaxBet != 0 && this.m_iMyBetCoin > this.m_iMaxBet)
        {
            ToastView.show("本局最大下注为：" + this.m_iMaxBet*this.tableRuleInfo.minante);
            var bigBet        = this.m_iMyBetCoin - this.m_iMaxBet;
            var lastPush      = this.BetArray.pop();
            var diffBet       = lastPush - bigBet;
            this.m_iMyBetCoin = this.m_iMaxBet;
            if (diffBet <= 0) {
                cc.warn("updateMaxBet ignore diffBet=", diffBet);
                return;
            }
            this.BetArray.push(diffBet);
            cc.log("updateMaxBet diffBet=", diffBet);
        }

        var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
        this.setPlayerBetCount(viewId, this.m_iMyBetCoin * this.tableRuleInfo.minante);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_BET);
        
    },

    createMenu : function () {
        cc.log("Bullfight_GameScene.createMenu");
        var self = this;
        var menuPop  = null;
        if(GameSystem.getInstance().roomLevel == 2)
        {
            var menuPop  = cc.instantiate(this.MenuRoomCard);
            this.node.addChild(menuPop);
            menuPop.setPosition(cc.p(0,0));
            menuPop.getComponent("Bullfighgt_Menu").setCallBackCarry(function () {
                cc.log("Bullfight_GameScene, Bullfighgt_Menu");
                self.createCarryView(20);
            });
            menuPop.getComponent("Bullfighgt_Menu").setRuleInfo(this.tableRuleInfo);
        }
        else
        {
            var menuPop  = cc.instantiate(this.Menu);
            this.node.addChild(menuPop);
            menuPop.setPosition(cc.p(0,0));
            menuPop.getComponent("Bullfighgt_Menu").setCallBackCarry(function () {
                cc.log("Bullfight_GameScene, Bullfighgt_Menu");
                self.createCarryView(20);
            });
            menuPop.getComponent("Bullfighgt_Menu").setRuleInfo(this.tableRuleInfo);
        }

    },
    
    createRoomInfoView : function () {
        cc.log("Bullfight_GameScene.createMenu");
        var RoomInfoView = cc.instantiate(this.RoomInfoView);
        this.node.addChild(RoomInfoView);
        RoomInfoView.setPosition(cc.p(0,0));
        RoomInfoView.getComponent("Bullfight_RoomInfo").setRoomInfo(this.tableRuleInfo);
    },
    
    createCarryView : function (time) {
        var carryPop = cc.instantiate(this.CarryView);
        this.node.addChild(carryPop);
        carryPop.setPosition(cc.p(0,0));
        carryPop.getComponent("Bullfight_CarryView").setCarryTime(time);
        cc.log("Bullfight_GameScene.createCarryView mincarry=", this.tableRuleInfo.mincarry,
                                                " maxcarry=", this.tableRuleInfo.maxcarry,
                                                " totalcarry=", this.tableRuleInfo.totalcarry);

        carryPop.getComponent("Bullfight_CarryView").setMinAndMax(this.tableRuleInfo.mincarry,
            this.tableRuleInfo.maxcarry, this.tableRuleInfo.totalcarry);
    },

    updatePlayerCallType : function(uid, callType) {
        var player = this.sitPlayers.get(uid);
        player.calltype = callType;
    },

    refreshCallBankerFlag : function(callUid, bMusic)
    {
        cc.log("refreshCallBankerFlag uid=", callUid);
        var player = this.findPlayer(callUid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[(player.calltype - 1) < 0 ? 0 : (player.calltype - 1)];

        if (bMusic) {
        	MusicMgr.playEffect((player.calltype - 1) == 0 ?  Bullfight_AudioConfig.AUDIO_MAN_NOCALLBANKER : Bullfight_AudioConfig.AUDIO_MAN_CALLBANKER);
        }
    },

    refreshReadyFlag : function(readyUid) {
        var player = this.findPlayer(readyUid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("refreshReadyFlag, uid=", readyUid, " seatid=", player.seatid, " viewid=", viewId);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[3];
    },

    refreshLookFlag : function(uid) {
        var player = this.findPlayer(uid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("refreshLookFlag, uid=", uid, " seatid=", player.seatid, " viewid=", viewId);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[4];
    },
    
    clearCallBankerFlag : function () {
        cc.log("clearCallBankerFlag");
        for (var index = 0; index < BULLFIGHT_MAX_PLAYER; index++)
        {
            this.CallBankerFlag[index].node.active = false;
        }
    },
    
    clearReadyFlag : function () {
        this.clearCallBankerFlag();
    },

    clearUserHeadBanker : function () {
        for(var index = 0;index < 6;index++)
        {
            this.PlayerItemPos[index].clearPlayerBanker();
        }
    },

    clearUserWinScore: function () {
        for (var index = 0;index < this.PlayerItemPos.length; index++)
        {
            this.PlayerItemPos[index].clearUserWinScore();
        }
    },

    /**************Clock********************/

    startClockTime : function (time) {
        this.time = time;
        this.clock.node.active = true;
        this.clock.updateTimeLabel(this.time);
        this.schedule(this.updateClockTime, 1);
    },

    updateClockTime : function () {
        this.clock.updateTimeLabel(this.time);
        this.time--;
        if (this.time < 0)
        {
            this.clock.node.active = false;
            this.tableStatusTimeOut();
            this.unschedule(this.updateClockTime);
        }
    },
    
    tableStatusTimeOut : function () {
        switch (this.tableStatus)
        {
           case Bullfight_TableStatus.E_TABLE_CLOSE_STATUS : //-2, //桌子关闭
                break;
           case Bullfight_TableStatus.E_TABLE_NOT_START_STATUS : //0,  //桌子为NULL
                break;
           case Bullfight_TableStatus.E_TABLE_READY_STATUS : //1,  //桌子准备
                //this.sendReady();
                break;
           case Bullfight_TableStatus.E_TABLE_CALL_STATUS  : //2,  //叫庄
                //this.sendCallBanker(1);
                break;
           case Bullfight_TableStatus.E_TABLE_BET_STATUS   : //3,  //下注
               //this.sendBetCoinReq(this.m_iMyBetCoin);
                break;
           case Bullfight_TableStatus.E_TABLE_OPEN_STATUS  : //4,  //开牌
               //this.sendOpenCard();
                break;
           case Bullfight_TableStatus.E_TABLE_OVER_STATUS  : //5,  //游戏结束
                break;
        }
    },

    showTableStatusBtn : function () {
        this.BtnStart.node.active     = false;
        this.BtnReady.node.active     = false;
        this.BtnCallBankerNode.active = false;
        //this.BetCoinNode.active  = false;
        if(GameSystem.getInstance().roomLevel == 2)
        {
            this.BtnBetRoomCardNode.active = false;
        }
        else
        {
            this.BtnBetNode.active = false;
        }
        this.OpenCardNode.active = false;
        this.clearCallBankerFlag();

        if ((GamePlayer.getInstance().bowner == 1) && (this.tableStatus == Bullfight_TableStatus.E_TABLE_NOT_START_STATUS)) {
            cc.log("showTableStatusBtn bowner=", GamePlayer.getInstance().bowner);
            this.BtnStart.node.active = true;
            this.Tips.node.string = "";
        }

        if (GamePlayer.getInstance().seatid == -1) {
            cc.log("showTableStatusBtn seatid=", GamePlayer.getInstance().seatid);
            return;
        }

        cc.log("showTableStatusBtn, this.tableStatus  = " + this.tableStatus);
        cc.log("showTableStatusBtn, this.playerStatus = " + GamePlayer.getInstance().status);

        switch (this.tableStatus) {
            case Bullfight_TableStatus.E_TABLE_CLOSE_STATUS : //-2, //桌子关闭
                break;

            case Bullfight_TableStatus.E_TABLE_NOT_START_STATUS : //0,  //桌子为NULL
                if (GamePlayer.getInstance().bowner == 1) {
                    this.BtnStart.node.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_READY_STATUS : //1,  //桌子准备
                //坐下or结束
                if ((GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_SIT_STATUS) ||
                    (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS)) {
                    this.BtnReady.node.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_CALL_STATUS  : //2,  //叫庄
                // 在游戏
                if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                    this.BtnCallBankerNode.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_BET_STATUS   : //3,  //下注
                //不是庄,且在游戏
                if ((this.bankerUid != GamePlayer.getInstance().uid) &&
                    (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS)) {
                    //this.BetCoinNode.active = true;
                    if(GameSystem.getInstance().roomLevel == 2)
                    {
                        this.BtnBetRoomCardNode.active = true;
                    }
                    else
                    {
                        this.BtnBetNode.active = true;
                    }
                }
                break;

            case Bullfight_TableStatus.E_TABLE_OPEN_STATUS  : //4,  //开牌
                if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                    this.OpenCardNode.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_OVER_STATUS  : //5,  //游戏结束
                break;

            case Bullfight_TableStatus.E_TABLE_IDLE_STATUS:
                break;
        }
    },

    /************   CardItem  ************************/
    
    sendCardsToPlayer : function (viewId, cardlist) {
        this.CardItem[viewId].sendCardAnimation(cardlist);
    },
    
    openplayerCards : function (viewId, cardlist, index1, index2) {
        this.CardItem[viewId].openCardAnimation(cardlist, index1, index2);
    },

    clearAllPlayerCardItem : function () {
        for(var index = 0;index < BULLFIGHT_MAX_PLAYER;index++)
        {
            this.CardItem[index].clearCardItem();
        }
    },
    
    setCardType : function (viewId, type, bMusic) {
        this.CardItem[viewId].setCardType(type);

        if (!bMusic) {
            return;
        }

        switch (type)
        {
            case Bullfight_CardType.E_BULL_ZERO:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL0);
                break;
            case Bullfight_CardType.E_BULL_ONE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL1);
                break;
            case Bullfight_CardType.E_BULL_TWO:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL2);
                break;
            case Bullfight_CardType.E_BULL_THREE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL3);
                break;
            case Bullfight_CardType.E_BULL_FOUR:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL4);
                break;
            case Bullfight_CardType.E_BULL_FIVE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL5);
                break;
            case Bullfight_CardType.E_BULL_SIX:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL6);
                break;
            case Bullfight_CardType.E_BULL_SEVEN:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL7);
                break;
            case Bullfight_CardType.E_BULL_EIGHT:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL8);
                break;
            case Bullfight_CardType.E_BULL_NINE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL9);
                break;
            case Bullfight_CardType.E_BULL_PAIR:
            	// MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL10);
                break;
            case Bullfight_CardType.E_BULL_BULL:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL10);
                break;
            case Bullfight_CardType.E_BULL_LINE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_LINE);
                break;
            case Bullfight_CardType.E_BULL_THREE_TWO:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_3AND2);
                break;
            case Bullfight_CardType.E_BULL_BOMB:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BOMB);
                break;

            case Bullfight_CardType.E_BULL_FIVE_KING:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_5FLOWER);
                break;

            case Bullfight_CardType.E_BULL_SMALL_FIVE:
            	MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_5LITTLEBULL);
                break;
            case Bullfight_CardType.E_BULL_MAX:
                break;
        }
    },
    
    setPlayerBetCount : function (viewId, count) {
        this.CardItem[viewId].setPlayerBetCount(count);
    },
    
    setCustomCardType : function (active) {
        this.CardItem[5].setCustomCardType(active);
    },
    

    /********** PLayer   ***************/
    delPlayer : function( uid) {
        let it = this.findPlayer(uid);
        cc.log("Bullfight_GameScene.delPlayer,uid = " + uid + " it = " + it);
        if (it != null) {
            this.removeOnePlayerInTable(it);
            if (this.sitPlayers.containsKey(uid)) {
                cc.log("Bullfight_GameScene.delPlayer, delete uid= " + uid + " by sitPlayers");
                this.sitPlayers.delete(uid);
                if(uid == GamePlayer.getInstance().uid) {
                    cc.log("Bullfight_GameScene.delPlayer, uid= " + uid + " seatid=-1");
                    GamePlayer.getInstance().seatid = -1;
                }
            }
        }
    },

    delAllPlayer : function ()
    {
        var self = this ;

        this.sitPlayers.forEach(function (ud) {
            self.removeOnePlayerInTable(ud);
        });
        GamePlayer.getInstance().seatid = -1;

        this.sitPlayers.clear();
        this.sitPlayers = new Map();
    },

    addPlayer : function(playerinfo)
    {
        this.delPlayer(playerinfo.uid);
        if (this.sitPlayers.size() < this.m_iMaxPlayers) {
            if (playerinfo.uid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().Copy(playerinfo);
                this.sitPlayers.set(GamePlayer.getInstance().uid, GamePlayer.getInstance());
                // this.refreshAllPlayerOnTable();
            } else {
                this.sitPlayers.set(playerinfo.uid, playerinfo);
                // this.showOnePlayerInTable(playerinfo);
            }
        }
    },

    refreshAllPlayerOnTable : function (bShowDetail) {
        this.clearAllPlayerCardItem();
        this.removeAllPlayerInTable();

        this.showTableStatusBtn();

    
        var action = cc.sequence(cc.fadeOut(0), cc.fadeIn(0.5)).speed(0.4);
        this.PlayNode.runAction(action);
    
        cc.log("Bullfight_GameScene.this.sitPlayers = " + this.sitPlayers.size());
        for(var index = 0; index < this.sitPlayers.size(); index++)
        {
            var player = this.sitPlayers.element(index).value;
            if (player == undefined) {
                cc.log("refreshAllPlayerOnTable player is undefined.");
                continue;
            }

            this.showOnePlayerInTable(player);

            if (!bShowDetail)
                continue;

            var viewId = this.getPlayerViewIdBySeatId(player.seatid);

            switch (this.tableStatus) {
                case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                    cc.log("E_TABLE_READY_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_READY_STATUS) {
                        this.refreshReadyFlag(player.uid);
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                    cc.log("E_TABLE_CALL_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.calltype > 0) {
                            this.refreshCallBankerFlag(player.uid, false);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            this.sendCardsToPlayer(viewId, player.cards);
                        } else {
                            var cards = [0,0,0,0,0];
                            this.sendCardsToPlayer(viewId, cards);
                        }
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_BET_STATUS   : //3,  //下注
                    cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " player.status=", player.status, " isbanker=",player.bBanker);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.bBanker == 1) {
                            cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " setbanker");
                            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
                            this.PlayerItemPos[viewId].setPlayerBanker();
                        } else if (player.betcoinmul > 0) {
                            cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " betcoinmul=", player.betcoinmul);
                            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
                            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            this.sendCardsToPlayer(viewId, player.cards);
                            if (player.bBanker == 0) {
                                this.showTableStatusBtn();
                            }
                        } else {
                            var cards = [0,0,0,0,0];
                            this.sendCardsToPlayer(viewId, cards);
                        }
                    }
                    break;

                case  Bullfight_TableStatus.E_TABLE_OPEN_STATUS: //4,  //开牌
                    cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " player.status=", player.status);

                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.bBanker == 1) {
                            cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " setbanker");
                            this.PlayerItemPos[viewId].setPlayerBanker();

                        } else if (player.betcoinmul > 0) {
                            cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " betcoinmul=", player.betcoinmul);
                            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            if (player.bOpenCard == 1) {
                                this.setCardType(viewId, player.bulltype, false);
                                this.openplayerCards(viewId, player.cards, -1, -1);
                                this.setCustomCardType(false);
                                this.OpenCardNode.active = false;
                                this.Tips.string = "等待其他玩家看牌";
                            } else {
                                this.openplayerCards(viewId, player.cards, -1, -1);
                                this.showTableStatusBtn();
                                this.setCustomCardType(true);
                            }
                        } else {
                            if (player.bOpenCard ==  1) {
                                this.setCardType(viewId, player.bulltype, false);
                                this.openplayerCards(viewId, player.cards, -1, -1);
                            } else {
                                var cards = [0,0,0,0,0];
                                this.sendCardsToPlayer(viewId, cards);
                            }
                        }
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_OVER_STATUS  : //5,  //游戏结束
                    cc.log("E_TABLE_OVER_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS) {

                        this.PlayerItemPos[viewId].setUserWinScore(player.finalcoin);

                        if (player.uid == GamePlayer.getInstance().uid && msg.seaters[index].finalcoin > 0) {
                            var pos = this.CallBankerFlag[viewid].node.position;
                            this.GiftAnimation.playWinAnimation(pos);
                        }
                    }

                case Bullfight_TableStatus.E_TABLE_IDLE_STATUS:
                    break;
            }
        }
    },

    showOnePlayerInTable : function (player) {
        if (player == undefined) {
            cc.error("Bullfight_GameScene.showOnePlayerInTable , player == undefined");
            return;
        }
        let viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("Bullfight_GameScene.showOnePlayerInTable, seatid = " + player.seatid, " viewId = " + viewId)
        this.PlayerItemPos[viewId].updatePlayerInfo(player);
    },

    playerStandUpOrDown : function (player,action) {
    },

    removeOnePlayerInTable : function(player)
    {
        cc.log("Bullfight_GameScene.removeOnePlayerInTable,status = " + player.status);
        let viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("Bullfight_GameScene.removeOnePlayerInTable, viewId = " + viewId + ",player.seatid = " + player.seatid);
        this.PlayerItemPos[viewId].clearPlayerInfo();

    },

    removeAllPlayerInTable : function () {
        for(var index = 0;index < 6;index++)
        {
            this.PlayerItemPos[index].clearPlayerInfo();
        }
    },

    getPlayerViewIdBySeatId : function (seatId)
    {
        let selfViewId = window.BULLFIGHT_MAX_PLAYER - 1;
        let viewId     = seatId;

        if (GamePlayer.getInstance().seatid  >= 0) {
            viewId =  (seatId - (GamePlayer.getInstance().seatid - selfViewId) + window.BULLFIGHT_MAX_PLAYER)%window.BULLFIGHT_MAX_PLAYER;
            cc.log("Bullfight_GameScene.getPlayerViewIdBySeatId, seatId = %d,viewId = %d",seatId,viewId, " myseatid=", GamePlayer.getInstance().seatid);
        } else {
            cc.log("Bullfight_GameScene.getPlayerViewIdBySeatId, seatId = %d,viewId = %d",seatId,viewId);
        }
        return viewId;
    },

    updatePlayerStatus : function(uid, status) {
        var player = this.sitPlayers.get(uid);
        player.status = status;
    },

    findPlayer : function( uid)
    {
        var player = this.sitPlayers.get(uid);
        return player;
    },

    findPlayerBySeatid : function(seatid)
    {
        let player = null ;
        this.sitPlayers.forEach(function (value) {
            if (value.seatid == seatid){
                player = value;
            }
        });
        return player ;
    },


    onPause : function () {
        this._super();

    },

    onResume : function()
    {
        this._super();
    },

});
