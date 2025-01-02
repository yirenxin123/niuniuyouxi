'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        scrollView: cc.ScrollView,
        MessageCell: cc.Prefab,
        MessageCellDetailView: cc.Prefab,
        SitReqCell: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.type = 0;
    },

    /*********************Network***************************/

    onMessage: function onMessage(event) {
        cc.log("MessageDetailView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_MSG_LIST_CMD_ID:
                this.onGetMessageList(msg);
                break;

            case CLUB_RESP_OWNER_CONFIRM_CMD_ID:
                cc.log("MessageDetailView.onMessage CLUB_RESP_OWNER_CONFIRM_CMD_ID");
                break;
        }
    },

    sendGetMsgList: function sendGetMsgList(type) {
        this.type = type;
        var data = {
            type: type,
            start: 0,
            total: 50
        };
        MessageFactory.createMessageReq(US_REQ_MSG_LIST_CMD_ID).send(data);
    },

    onGetMessageList: function onGetMessageList(msg) {
        if (msg.code != SocketRetCode.RET_SUCCESS) {
            return;
        }

        if (msg.list == null || msg.list == undefined) {
            return;
        }

        if (msg.type == 1) {
            //系统消息
            var cellHeight = 0;
            this.scrollView.content.removeAllChildren(true);

            for (var index = 0; index < msg.list.length; index++) {
                var json = BASE64.decoder(msg.list[index].msg);
                cc.log("MessageDetailView.onMsgList,json = " + json);
                var MessageCell = cc.instantiate(this.MessageCell);
                this.scrollView.content.addChild(MessageCell);
                cellHeight = MessageCell.getContentSize().height;
                MessageCell.setPosition(cc.p(0, -MessageCell.getContentSize().height * (index + 0.5)));
                MessageCell.getComponent('MessageCell').setMessageCellMsg(msg.list[index]);
                var self = this;
                MessageCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                    var msg = event.target.getComponent('MessageCell').msg;
                    self.createMessageCellDetailView(msg);
                }.bind(this));
            }

            if (cellHeight * msg.list.length > this.scrollView.content.height) {
                this.scrollView.content.height = cellHeight * msg.list.length;
            }
        } else if (msg.type == 2) {
            //俱乐部消息

            this.scrollView.content.removeAllChildren(true);
            var _cellHeight = 0;

            for (var index = 0; index < msg.list.length; index++) {
                var json = BASE64.decoder(msg.list[index].msg);
                msg.list[index].msg = JSON.parse(json);
                cc.log("MessageView.onMsgList,msg.list[index].msg = ", msg.list[index].msg);

                var SitReqCell = cc.instantiate(this.SitReqCell);
                this.scrollView.content.addChild(SitReqCell);
                _cellHeight = SitReqCell.getContentSize().height;
                SitReqCell.setPosition(cc.p(0, -SitReqCell.getContentSize().height * (index + 1)));
                SitReqCell.getComponent("SitReqCell").setMessageInfo(msg.list[index], 2);
            }
            if (_cellHeight * (msg.list.length + 1) > this.scrollView.content.height) {
                this.scrollView.content.height = _cellHeight * (msg.list.length + 1);
            }
        }
    },

    createMessageCellDetailView: function createMessageCellDetailView(msg) {
        var MessageCellDetailView = cc.instantiate(this.MessageCellDetailView);
        this.node.addChild(MessageCellDetailView);
        MessageCellDetailView.setPosition(cc.p(0, 0));
        MessageCellDetailView.getComponent('MessageCellDetailView').setContent(msg);
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageDetailView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageDetailView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        }
    }

});