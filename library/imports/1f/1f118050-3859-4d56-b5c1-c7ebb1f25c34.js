'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var UtilTool = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        RoomName: {
            default: null,
            type: cc.Label
        },
        GameName: {
            default: null,
            type: cc.Label
        },
        GameType: {
            default: null,
            type: cc.Label
        },
        MinAnte: {
            default: null,
            type: cc.Label
        },
        LiveTime: {
            default: null,
            type: cc.Label
        },
        MaxSeat: {
            default: null,
            type: cc.Label
        },

        SelfWinCoin: {
            default: null,
            type: cc.Label
        },
        SelfCarryCoin: {
            default: null,
            type: cc.Label
        },
        SelfPlayNum: {
            default: null,
            type: cc.Label
        },
        SelfWinNum: {
            default: null,
            type: cc.Label
        },
        SelfLoseNum: {
            default: null,
            type: cc.Label
        },
        SelfSuperNum: {
            default: null,
            type: cc.Label
        },
        SelfNormalNum: {
            default: null,
            type: cc.Label
        },
        SelfNotcallNum: {
            default: null,
            type: cc.Label
        },
        SelfBankerNum: {
            default: null,
            type: cc.Label
        },
        SelfGiftNum: {
            default: null,
            type: cc.Label
        },
        SelfUseGold: {
            default: null,
            type: cc.Label
        },
        SelfUseDiamond: {
            default: null,
            type: cc.Label
        },

        scrollView: cc.ScrollView,
        PlayScorePrefab: cc.Prefab,
        BtnShare: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            this.BtnShare.node.active = false;
        }
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("RoomInfoView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_SCORE_DETAIL_CMD_ID:
                this.onScoreDetailbMsg(msg);
                break;
        }
    },

    //{"cmd":131214,"seq":2,"uid":11279,"code":0,"desc":"执行成功",
    // "param":{
    //  "table":{"tablename":"游客11279","gameid":101,"minante":1,"gametype":1,"livetime":1800,"maxseat":2},
    //  "myself":{"carrycoin":4000,"wincoin":-954,"winnum":6,"losenum":10,"playnum":16,"supernum":10,
    //   "normalnum":3,"notcallnum":3,"bankernum":11,"chatnum":0,"giftnum":0,"usegold":0,"usediamond":100},
    // "list":[{"uid":11279,"name":"游客11279","headurl":" ","carrycoin":4000,"wincoin":-954},
    //         {"uid":11300,"name":"游客11300","headurl":"","carrycoin":1000,"wincoin":954}]}}
    onScoreDetailbMsg: function onScoreDetailbMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.RoomName.string = msg.table.tablename;
            this.GameName.string = GetGameName(msg.table.gameid);
            this.GameType.string = GetGameType(msg.table.gametype);
            this.MinAnte.string = msg.table.minante;
            this.LiveTime.string = UtilTool.getHourTime(msg.table.livetime);
            this.MaxSeat.string = msg.table.maxseat + "人";

            this.SelfWinCoin.string = msg.myself.wincoin;
            this.SelfCarryCoin.string = msg.myself.carrycoin;
            this.SelfPlayNum.string = msg.myself.playnum;
            this.SelfWinNum.string = msg.myself.winnum;
            this.SelfLoseNum.string = msg.myself.losenum;
            this.SelfSuperNum.string = msg.myself.supernum;
            this.SelfNormalNum.string = msg.myself.normalnum;
            this.SelfNotcallNum.string = msg.myself.notcallnum;
            this.SelfBankerNum.string = msg.myself.bankernum;
            this.SelfGiftNum.string = msg.myself.giftnum;
            this.SelfUseGold.string = msg.myself.usegold;
            this.SelfUseDiamond.string = msg.myself.usediamond;

            cc.log("this.scrollView.content.height =", this.scrollView.content.height);

            var height = 0;
            var defaultPos = 1320;
            for (var index = 0; msg.list != null && index < msg.list.length; index++) {
                var playScore = cc.instantiate(this.PlayScorePrefab);
                this.scrollView.content.addChild(playScore);
                height = playScore.getContentSize().height;
                playScore.setPosition(cc.p(0, -defaultPos - playScore.getContentSize().height * index));
                playScore.getComponent("PlayScore").setScoreInfo(msg.list[index]);
            }
            cc.log("height * (msg.list.length) =" + height * msg.list.length);

            if (height * msg.list.length + defaultPos > this.scrollView.content.height) {
                this.scrollView.content.height = height * msg.list.length + defaultPos;
            }
            cc.log("this.scrollView.content.height =", this.scrollView.content.height);
        }
    },

    sendGetSuccessDetail: function sendGetSuccessDetail(msg) {
        var data = {
            privateid: msg.privateid,
            createtime: msg.createtime
        };
        MessageFactory.createMessageReq(US_REQ_SCORE_DETAIL_CMD_ID).send(data);
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        var BtnName = event.target.getName();
        if (BtnName == "BtnBack") {
            this.dismiss();
        } else if (BtnName == "BtnShare") {
            var message = {
                popView: "RoomInfoView",
                btn: "BtnShare"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        }
    }

});