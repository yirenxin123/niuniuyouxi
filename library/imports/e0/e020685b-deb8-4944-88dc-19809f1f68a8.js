'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        MessageDetailView: cc.Prefab,
        ScrollView: cc.ScrollView,
        NoticeMsgCell: cc.Node,
        NoticeRedTip: cc.Node,
        NoticeNum: cc.Label,
        ClubMsgCell: cc.Node,
        ClubMsgRedTip: cc.Node,
        ClubMsgNum: cc.Label,
        SitReqCell: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        MessageFactory.createMessageReq(US_REQ_NEW_MSG_NUM_CMD_ID).send();
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.CellNum = 0;
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("MessageView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_NEW_MSG_NUM_CMD_ID:
                this.onNewMsg(msg);
                break;

            case US_RESP_MSG_LIST_CMD_ID:
                this.onMsgList(msg);
                break;

            case US_RESP_OWNER_CONFIRM_CMD_ID:
                this.onOwnerConfirm(msg);
                break;
        }
    },

    onOwnerConfirm: function onOwnerConfirm(msg) {
        if (msg.code < SocketRetCode.RET_SUCCESS) {
            cc.log("MessageView.onOwnerConfirm");
            this.dismiss();
        } else {}
    },

    onMsgList: function onMsgList(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.type == 1) {} else if (msg.type == 2) {} else if (msg.type == 3) {
                var cellCount = this.ScrollView.content.getChildrenCount();
                if (msg.list == null || msg.list == undefined) return;
                var cellHeight = 0;
                for (var index = 0; index < msg.list.length; index++) {
                    var json = BASE64.decoder(msg.list[index].msg);
                    msg.list[index].msg = JSON.parse(json);
                    cc.log("MessageView.onMsgList,json = " + msg.list[index].msg);

                    var SitReqCell = cc.instantiate(this.SitReqCell);
                    this.ScrollView.content.addChild(SitReqCell);
                    cellHeight = SitReqCell.getContentSize().height;
                    SitReqCell.setPosition(cc.p(0, -SitReqCell.getContentSize().height * (cellCount + index + 1)));
                    SitReqCell.getComponent("SitReqCell").setMessageInfo(msg.list[index], msg.type);
                }

                if (cellHeight * (this.ScrollView.content.getChildrenCount() + 1) > this.ScrollView.content.height) {
                    this.ScrollView.content.height = cellHeight * (this.ScrollView.content.getChildrenCount() + 1);
                }
            }
        }
    },

    onNewMsg: function onNewMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.sysnum > 0) {
                this.NoticeRedTip.active = true;
                this.NoticeNum.string = msg.sysnum;
                this.CellNum++;
            }

            if (msg.clubnum > 0) {
                this.ClubMsgRedTip.active = true;
                this.ClubMsgNum.string = msg.clubnum;
                this.CellNum++;
            }

            var data = {
                type: 3,
                start: 0,
                total: 50
            };
            MessageFactory.createMessageReq(US_REQ_MSG_LIST_CMD_ID).send(data);
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (btnName == "BtnClose") {
            this.dismiss();
        } else if (btnName == "NoticeMsgCell") {
            var MessageDetailView = cc.instantiate(this.MessageDetailView);
            this.node.addChild(MessageDetailView);
            MessageDetailView.setPosition(cc.p(0, 0));
            MessageDetailView.getComponent('MessageDetailView').sendGetMsgList(1);
        } else if (btnName == "ClubMsgCell") {
            cc.log("MessageView.ClubMsgCell");
            var MessageDetailView = cc.instantiate(this.MessageDetailView);
            this.node.addChild(MessageDetailView);
            MessageDetailView.setPosition(cc.p(0, 0));
            MessageDetailView.getComponent('MessageDetailView').sendGetMsgList(2);
        }
    }
});