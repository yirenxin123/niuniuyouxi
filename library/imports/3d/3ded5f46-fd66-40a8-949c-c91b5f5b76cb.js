'use strict';

var BasePop = require('BasePop');
var ClubLevelCell = require('ClubLevelCell');
var GamePlayer = require('GamePlayer');
var UtilTool = require('UtilTool');
var GameSystem = require('GameSystem');
var ToastView = require('ToastView');

cc.Class({
    extends: BasePop,

    properties: {
        ClubLvFlag: cc.Sprite,
        ClubLvFlagFrame: [cc.SpriteFrame],
        FontCurLevel: cc.Label,
        TimeLabel: cc.Label,
        CurDiamond: cc.Label,

        clubLevelCell: cc.Prefab,
        Content: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        //this.initBaseData();
    },

    start: function start() {
        this.initBaseData();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    // {"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    // {"level":2,"livetime":30,"diamond":1000, "maxpeople":50, "maxtable":3},
    // {"level":3,"livetime":30,"diamond":4000, "maxpeople":100,"maxtable":4},
    // {"level":4,"livetime":30,"diamond":10000,"maxpeople":200,"maxtable":9}
    initBaseData: function initBaseData() {

        this.initCurClubInfo();
        var height = 0;
        for (var index = 0; index < GameSystem.getInstance().ClubUpgradeCost.length; index++) {
            var levelItem = cc.instantiate(this.clubLevelCell);
            height = levelItem.getContentSize().height;
            levelItem.setPosition(cc.p(0, 0 - 620 - height * index));
            this.Content.addChild(levelItem);
            levelItem.getComponent('ClubLevelCell').setCellInfo(GameSystem.getInstance().ClubUpgradeCost[index]);
        }
    },

    initCurClubInfo: function initCurClubInfo() {
        this.FontCurLevel.string = UtilTool.getClubLevelName(GamePlayer.getInstance().CurClubInfo.level);
        this.ClubLvFlag.spriteFrame = this.ClubLvFlagFrame[GamePlayer.getInstance().CurClubInfo.level - 1];
        this.TimeLabel.string = UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.endtime);
        this.CurDiamond.string = GamePlayer.getInstance().diamond;
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        cc.log("ClubLevelCell.onMessage cmd=", msg.cmd, " window.CLUB_RESP_MODIFY_INFO_CMD_ID=", window.CLUB_RESP_MODIFY_INFO_CMD_ID);
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.updateUserDiamond(msg);
                break;
        }
    },

    updateUserDiamond: function updateUserDiamond(msg) {
        cc.log("ClubLevelCell.updateUserDiamond");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        this.initCurClubInfo();
    },

    // ClubId  int    `json:"clubid"`
    // Status  int    `json:"status"`
    // Name    string `json:"name"`
    // HeadUrl string `json:"headurl"`
    // Address string `json:"address"`
    // Intro   string `json:"intro"`
    // Level   int    `json:"level"`
    // EndTime int64  `json:"endtime"`
    onModifyInfoMsg: function onModifyInfoMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("ClubLevelCell.onModifyInfoMsg code=", msg.code, " endtime=", msg.param.endtime);
            GamePlayer.getInstance().CurClubInfo.level = Number(msg.param.level);
            GamePlayer.getInstance().CurClubInfo.endtime = msg.param.endtime;
            var info = this.getCurLevelInfo(msg.param.level);
            cc.log("ClubLevelCell.onModifyInfoMsg  info=", info);

            GamePlayer.getInstance().CurClubInfo.maxmember = info.maxpeople;

            ToastView.show("升级成功: " + UtilTool.getFormatDataDetail(GamePlayer.getInstance().CurClubInfo.endtime) + "到期", 2);
            this.getUserDetail();
            this.initCurClubInfo();
        } else {
            ToastView.show(msg.desc);
        }
    },

    getCurLevelInfo: function getCurLevelInfo(level) {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        for (var i = 0; i < list.length; i++) {
            if (level == list[i].level) {
                return list[i];
            }
        }
        return list[0];
    }

});