'use strict';

var BasePop = require('BasePop');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        Name: cc.EditBox,
        Intro: cc.EditBox
    },

    onLoad: function onLoad() {
        this._super();

        this.setClubInfo();
    },

    setClubInfo: function setClubInfo() {
        cc.log("ClubSetView.setClubInfo");
        this.Name.string = GamePlayer.getInstance().CurClubInfo.name;
        this.Intro.string = GamePlayer.getInstance().CurClubInfo.intro;
        //info.headurl;
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubSetView.callBackBtn, BtnName = " + BtnName);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnClose") {
            this.dismiss();
            var message = {
                popView: "ClubSetView",
                btn: "BtnClose"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnSave") {
            var info = GamePlayer.getInstance().CurClubInfo;
            var data = {
                clubid: info.clubid,
                headurl: "",
                name: this.Name.string,
                intro: this.Intro.string
            };

            if (data.name == GamePlayer.getInstance().CurClubInfo.name) {
                data.name = "";
            }
            cc.log("ClubSetView.callBackBtn headurl=", data.headurl, " name=", data.name, " intro=", data.intro);
            MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
        }
    },

    onMessage: function onMessage(event) {
        cc.log("ClubSetView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;
        }
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
        cc.log("ClubSetView.onModifyInfoMsg code=", msg.code);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GamePlayer.getInstance().CurClubInfo.name = this.Name.string;
            GamePlayer.getInstance().CurClubInfo.intro = this.Intro.string;
            ToastView.show("修改成功！！！");
        } else {
            ToastView.show(msg.desc);
        }
    }
});