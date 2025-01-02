'use strict';

var MessageFactory = require("MessageFactory");
var MusicMgr = require('MusicMgr');
var Audio_Comm = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");
var Bullfight_AudioConfig = require('Bullfight_AudioConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        seatFlag: 0, //0:没有玩家坐下，1:已经有玩家坐下
        seatId: 0,
        userHead: cc.Sprite,
        userNick: cc.Label,
        userGold: cc.Label,
        winScoreBg: cc.Sprite,
        winScore: cc.Label,
        bankerFlag: cc.Sprite,
        bankerLight: cc.Sprite,
        TimeBar: cc.ProgressBar,
        win_animation: cc.Sprite,
        UserInfoView: cc.Prefab,
        YouWin: cc.Sprite,
        DefaultHead: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.BankerFlagPos = this.bankerFlag.node.getPosition();
        this.winScoreBgPos = this.bankerFlag.node.getPosition();
        //this.player = null;
    },

    setUserHead: function setUserHead(Spriteframe) {
        //cc.log('Bullfight_PlayerItem.setUserHead')
        this.userHead.spriteFrame = Spriteframe;
    },

    setUserNick: function setUserNick(nick) {
        //cc.log('Bullfight_PlayerItem.setUserHead, nick = ' + nick);
        this.userNick.string = nick;
    },

    setUserGold: function setUserGold(gold) {
        //cc.log('Bullfight_PlayerItem.setUserGold, gold = ' + gold);
        this.userGold.string = gold;
        this.userGold.node.color = cc.Color.WHITE;
    },

    setUserWaitCarry: function setUserWaitCarry() {
        this.userGold.string = "携带中..";
        this.userGold.node.color = new cc.Color(204, 160, 41, 255);
    },

    setUserWinScore: function setUserWinScore(score) {
        this.winScore.string = score;
        this.winScoreBg.node.active = true;
        this.winScoreBg.getComponent(cc.Animation).play("WinScoreAni");
    },

    clearUserWinScore: function clearUserWinScore() {
        //cc.log("Bullfight_PlayerItem.clearUserWinScore");
        this.winScoreBg.node.active = false;
    },

    getSeatIdByViewId: function getSeatIdByViewId(viewId) {
        var selfViewId = window.BULLFIGHT_MAX_PLAYER - 1;
        var seatId = viewId;

        if (GamePlayer.getInstance().seatid >= 0) {
            seatId = (viewId - selfViewId + GamePlayer.getInstance().seatid + window.BULLFIGHT_MAX_PLAYER) % window.BULLFIGHT_MAX_PLAYER;
        }
        cc.log("********getSeatIdByViewId viewId=", viewId, " seatId=", seatId);
        return seatId;
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        cc.log("Bullfight_PlayerItem.callbackBtn,btnName = " + btnName);

        MusicMgr.playEffect(Audio_Comm.AUDIO_BTN_CLICK);

        if (btnName = "Bg") {
            if (this.seatFlag == 0) {
                var seatid = this.getSeatIdByViewId(this.seatId);
                cc.log("Bullfight_PlayerItem.callbackBtn,this.seatId = " + seatid);
                var data = {
                    status: 1,
                    seatid: seatid
                };
                MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
                MusicMgr.playEffect(Audio_Comm.AUDIO_SIT);
            } else {
                //显示玩家信息
                var UserInfoView = cc.instantiate(this.UserInfoView);
                cc.director.getScene().addChild(UserInfoView);
                UserInfoView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
                UserInfoView.getComponent("Bullfight_UserInfo").setPlayerInfo(this.player);
            }
        }
    },

    setPlayerBanker: function setPlayerBanker() {
        this.bankerFlag.node.active = true;
        this.bankerLight.node.active = true;
    },

    clearPlayerBanker: function clearPlayerBanker() {
        this.bankerFlag.node.active = false;
        this.bankerLight.node.active = false;
    },

    clearPlayerInfo: function clearPlayerInfo() {
        //cc.log("Bullfight_GameScene.clearPlayerInfo, seatId= " + this.seatId);
        this.setUserNick("");
        this.setUserGold(0);
        this.clearUserWinScore();
        this.userHead.node.active = false;
        this.seatFlag = 0;
        this.bankerFlag.node.active = false;
        this.userHead.spriteFrame = this.DefaultHead;
    },

    updatePlayerInfo: function updatePlayerInfo(player) {

        this.player = player;

        this.userHead.node.active = true;

        this.setUserNick(player.name);

        if (player.coin > 0) {
            this.setUserGold(player.coin);
        } else {
            this.setUserWaitCarry();
        }

        UpdateWXHeadIcon(player.headurl, this.userHead);

        this.seatFlag = 1;
    },

    getPointByAngle: function getPointByAngle(startpoint, angle, radius) {

        if (angle <= 90 && angle >= 0) {
            return cc.p(startpoint.x + Math.sin(angle) * radius, startpoint.y - (radius - Math.cos(angle) * radius));
        } else if (angle > 90 && angle <= 180) {
            cc.p(startpoint.x + Math.sin(180 - angle) * radius, startpoint.y - (radius - Math.cos(180 - angle) * radius - radius));
        } else if (angle > 180 && angle <= 270) {
            cc.p(startpoint.x - Math.sin(270 - angle) * radius, startpoint.y - (radius - Math.cos(270 - angle) * radius - radius));
        } else if (angle > 270 && angle < 360) {
            return cc.p(startpoint.x - Math.sin(360 - angle) * radius, startpoint.y - (radius - Math.cos(360 - angle) * radius));
        }
    }
});