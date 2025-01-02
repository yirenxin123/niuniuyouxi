"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lableMsg: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.GameInfoListenerID = -1;
        this.socketMessageListenerID = -1;
        this.node.opacity = 0;
        this.tipsCount = 0;

        this.isNetConnecting = true;

        this.baseTips = "";

        this.onNetCheckListener();
        this.addSocketListener();
    },

    onDestroy: function onDestroy() {
        GlobalEventManager.getInstance().removeListener(this.GameInfoListenerID);
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
    },

    onNetCheckListener: function onNetCheckListener() {
        var self = this;
        this.GameInfoListenerID = GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo, function (event) {
            if (event) {
                var tag = event.tag;
                if (tag == window.GameInfo.NetOnline) {
                    self.isNetConnecting = true;
                    self.node.opacity = 0;
                    self.unschedule(self.updateTipShow);
                } else if (tag == window.GameInfo.NetOffline) {
                    self.isNetConnecting = false;
                    self.node.opacity = 255;
                    self.tipsCount = 0;

                    self.baseTips = "网络异常，正在重连中";
                    self.lableMsg.string = self.baseTips;
                    self.schedule(self.updateTipShow, 0.3);
                }
            }
        }, this);
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
            if (type == window.MessageType.SOCKET_CONNECTED) {
                self.onSocketConnected();
            }
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {
                    self.onSocketDisconnected();
                }
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {}
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {}
        }, this);
    },

    onSocketConnected: function onSocketConnected() {
        var self = this;
        self.node.opacity = 0;
        self.unschedule(self.updateTipShow);
    },

    onSocketDisconnected: function onSocketDisconnected() {

        var self = this;
        self.unschedule(self.updateTipShow);
        if (self.isNetConnecting) {
            self.node.opacity = 255;
            self.tipsCount = 0;

            self.baseTips = "服务器连接失败，努力重连中";
            self.lableMsg.string = self.baseTips;

            self.schedule(self.updateTipShow, 0.3);
        }
    },

    updateTipShow: function updateTipShow(tips) {
        this.tipsCount++;
        var tips = this.baseTips;
        var index = this.tipsCount % 4;
        for (var i = 0; i < index; i++) {
            tips += "。";
        }
        this.lableMsg.string = tips;
    }

});