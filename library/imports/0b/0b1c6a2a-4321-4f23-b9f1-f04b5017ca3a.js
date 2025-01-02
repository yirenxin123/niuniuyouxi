'use strict';

var BaseView = require("BaseView");
var SocketManager = require('SocketManager');
var MessageFactory = require('MessageFactory');

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("BasePop");
        this.localMessageListenerID = -1;
        this.httpMessageListenerID = -1;
        this.socketMessageListenerID = -1;

        // socket消息
        this.addSocketListener();

        // http消息
        this.addHttpListener();

        // 本地消息监听
        this.addLocalMessageListener();

        cc.log('BasePop:onLoad');

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));
    },

    onDestroy: function onDestroy() {
        cc.log('BasePop:onDestroy');

        cc.log("BasePop.socketMessageListenerID=", this.httpMessageListenerID);
        if (this.httpMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.httpMessageListenerID);
            this.httpMessageListenerID = -1;
        }

        cc.log("BasePop.localMessageListenerID=", this.localMessageListenerID);
        if (this.localMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.localMessageListenerID);
            this.localMessageListenerID = -1;
        }

        cc.log("BasePop.socketMessageListenerID=", this.socketMessageListenerID);
        if (this.socketMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
            this.socketMessageListenerID = -1;
        }
    },

    //socket消息
    addSocketListener: function addSocketListener() {
        var self = this;
        this.socketMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.SocketMessage, function (event) {
            if (event == undefined) {
                return;
            }
            var type = event.tag;
            //连接服务器成功
            if (type == window.MessageType.SOCKET_CONNECTED) {}
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {}
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {}
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {
                                self.onMessage(event);
                            } else if (type == window.MessageType.SCENE_MSG) {
                                self.onSceneMsg(event);
                            }
        }, this);
        cc.log("BasePop.socketMessageListenerID=", this.socketMessageListenerID);
    },

    //http消息监听
    addHttpListener: function addHttpListener() {
        var self = this;
        this.httpMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.HttpMessage, function (event) {
            if (event == undefined) {
                return;
            }

            var tag = event.tag;

            if (tag == window.HttpMessageType.HTTP_NOTIFICATION) {
                self.onHttpResponse(event.msg);
            } else if (tag == window.HttpMessageType.NOTIFY_HTTP_RSP_ERROR) {}
        }, this);
        cc.log("BasePop.socketMessageListenerID=", this.httpMessageListenerID);
    },

    //本地消息监听
    addLocalMessageListener: function addLocalMessageListener() {
        var self = this;
        this.localMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.LocalMessage, function (event) {
            self.onLocalMessage(event);
        }, this);
        cc.log("BasePop.localMessageListenerID=", this.localMessageListenerID);
    },

    onMessage: function onMessage(event) {},

    onLocalMessage: function onLocalMessage(event) {
        if (event == undefined) {
            return;
        }
        var tag = event.tag;

        if (tag == window.LocalMsgType.SENDMSG_TIMEOUT) {
            this.msgSendTimeOut();
        } else if (tag == window.LocalMsgType.UPDATE_USERINFO) {}
    },

    onHttpResponse: function onHttpResponse(event) {
        if (event == undefined) {
            return;
        }
        if (!event.isSucceed) {
            return;
        }
    },

    onSceneMsg: function onSceneMsg(event) {},

    scaleTo: function scaleTo(node, flag) {
        node.setScale(0);
        var scaleT0 = null;
        if (flag) {
            scaleT0 = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        } else {
            scaleT0 = cc.scaleTo(0.1, 0.8).easing(cc.easeBackOut());
        }

        node.runAction(scaleT0);
    },

    getUserDetail: function getUserDetail() {
        cc.log("BaseScene.getUserDetail");
        var detail = MessageFactory.createMessageReq(window.US_REQ_USER_DETAIL_CMD_ID);
        if (detail) {
            detail.send();
        }
    },

    LeftInTo: function LeftInTo(node) {
        var winSize = cc.director.getWinSize();
        //node.position.x = node.position.x - winSize.width;
        //node.setPositionX(node.position.x - winSize.width);
        node.runAction(cc.moveTo(0.1, cc.p(node.position.x + winSize.width, node.position.y)));
    },

    dismiss: function dismiss() {
        cc.log('BasePop:dismiss');
        this.node.removeFromParent(true);
        this.destroy();
    }
});