'use strict';

var UtilTool = require('UtilTool');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var LoadingView = require('LoadingView');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: cc.Component,

    properties: {
        Head: cc.Sprite,
        RoomName: cc.Label,
        PrivateCode: cc.Label,
        CreatorName: cc.Label,
        MinBet: cc.Label,
        timeLabel: cc.Label,
        bankerMode: cc.Label,
        ClubFlag: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.roomInfo = null;
        this.time = 0;
    },

    //"list":[
    // {"ownername":"游客10688","tablename":"游客10688","headurl":"",
    // "minante":1,"remaintime":1800,"gametype":1,"gameid":101,"gamesvcid":5,"tableid":0},
    // {"ownername":"游客10688","tablename":"游客10688","headurl":"","minante":1,"remaintime":1800,
    // "gametype":1,"gameid":101,"gamesvcid":5,"tableid":0}]}

    //called every frame, uncomment this function to activate update callback
    updateTime: function updateTime() {
        this.time--;
        this.timeLabel.string = UtilTool.getTime(this.time);
        if (this.time < 0) {
            this.timeLabel.string = "已结束";
            this.unschedule(this.updateTime);
        }
    },

    strLength: function strLength(str) {
        var l = str.length;
        var blen = 0;
        for (var i = 0; i < l; i++) {
            if ((str.charCodeAt(i) & 0xff00) != 0) {
                blen++;
            }
            blen++;
        }
        return blen;
    },

    subName: function subName(name) {
        var len = this.strLength(name);
        if (len > 8) {
            name = name.substr(0, 8);
            name += "..";
        }
        return name;
    },

    updateRoomInfo: function updateRoomInfo(cellMsg) {
        this.roomInfo = cellMsg;

        cc.log("GamblingHouseCell.updateRoomInfo,cellMsg = " + cellMsg);
        this.RoomName.string = this.subName(cellMsg.tablename);
        cc.log("GamblingHouseCell.updateRoomInfo name=", this.subName(cellMsg.tablename));

        this.CreatorName.string = cellMsg.ownername;
        this.PrivateCode.string = cellMsg.privateid;
        this.MinBet.string = cellMsg.minante;
        this.time = cellMsg.remaintime;
        this.timeLabel.string = UtilTool.getTime(cellMsg.remaintime);

        if (cellMsg.starttime > 0) {
            this.schedule(this.updateTime, 1);
        }
        this.MinBet.string = cellMsg.minante;
        this.time = cellMsg.remaintime;
        this.timeLabel.string = UtilTool.getTime(cellMsg.remaintime);
        UpdateWXHeadIcon(cellMsg.headurl, this.Head);

        if (cellMsg.gametype == 1) {
            this.bankerMode.string = "闭牌抢庄";
        } else {
            this.bankerMode.string = "三张抢庄";
        }

        if (Number(cellMsg.clubid) > 0) {
            this.ClubFlag.node.active = true;
        } else {
            this.ClubFlag.node.active = false;
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        cc.log("GamblingHouseCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("GamblingHouseCell.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "GamblingHouseCell") {
            //{"ownername":"游客10688","tablename":"游客10688","headurl":"","minante":1,"remaintime":144,
            // "gametype":1,"gameid":101,"gamesvcid":5,"tableid":0}]

            if (this.time < 0) {
                ToastView.show("游戏已结束");
            } else {
                var self = this;
                var alertExit = AlertView.create();
                alertExit.setPositiveButton(function () {
                    self.enterRoom();
                });
                alertExit.showOne("是否进入游戏？", AlertViewBtnType.E_BTN_CLOSE);
            }
        }
    },

    callBackGameMode: function callBackGameMode(event, CustomEventData) {
        cc.log("GamblingHouseCell.callBackGameMode, btnName = " + event.target.getName());
        cc.log("GamblingHouseCell.callBackGameMode, CustomEventData = " + CustomEventData);
        if (Number(CustomEventData) == 1) {
            var message = {
                popView: "GamblingHouseCell",
                btn: "winxinShared"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        }
    },

    enterRoom: function enterRoom() {
        var message = {
            popView: "GamblingHouseCell",
            btn: "enterRoom"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });

        LoadingView.show("正在进入...");

        var findRoomReq = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid: this.roomInfo.privateid
        };

        if (findRoomReq) {
            findRoomReq.send(data);
        }
    }
});