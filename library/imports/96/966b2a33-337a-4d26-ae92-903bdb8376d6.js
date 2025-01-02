'use strict';

var UtilTool = require('UtilTool');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var MessageFactory = require('MessageFactory');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ClubLevelFlag: cc.Sprite,
        FontLevel: cc.Label,
        FontLvInfo: cc.Label,
        FontNeedDia: cc.Label,
        LevelFlagFrame: [cc.SpriteFrame],
        LevelNum: 0,
        LevelCost: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //{"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    setCellInfo: function setCellInfo(msg) {
        this.setClubLevel(msg.level);
        this.FontNeedDia.string = "" + msg.diamond;
        this.LevelCost = msg.diamond;
        this.FontLvInfo.string = "提高人数上限至" + msg.maxpeople + "人，可设管理员" + msg.level + "人。持续" + msg.livetime + "天";
    },

    setClubLevel: function setClubLevel(level) {
        this.LevelNum = level;
        this.FontLevel.string = UtilTool.getClubLevelName(level);
        this.ClubLevelFlag.spriteFrame = this.LevelFlagFrame[level - 1];
    },

    CallBackBtn: function CallBackBtn() {
        if (GamePlayer.getInstance().CurClubInfo.level < this.LevelNum) {
            if (GamePlayer.getInstance().diamond < this.LevelCost) {
                ToastView.show("您的钻石不足" + ",无法购买" + UtilTool.getClubLevelName(this.LevelNum) + "，请前往商城购买钻石");
            } else {
                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    self.sendUpClubPacket();
                }, "确认");
                alert.show("您是否确认花费" + this.LevelCost + "个钻石购买" + UtilTool.getClubLevelName(this.LevelNum), AlertViewBtnType.E_BTN_CLOSE);
            }
        } else {
            ToastView.show("您已购买" + UtilTool.getClubLevelName(this.LevelNum) + ",无法降级购买");
        }
    },

    sendUpClubPacket: function sendUpClubPacket() {
        var info = GamePlayer.getInstance().CurClubInfo;
        var data = {
            clubid: info.clubid,
            headurl: "",
            intro: "",
            address: "",
            level: this.LevelNum
        };
        MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
    }

});