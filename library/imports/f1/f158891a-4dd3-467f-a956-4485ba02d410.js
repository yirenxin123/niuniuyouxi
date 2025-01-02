'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var GamblingHouseCell = require('GamblingHouseCell');
var AdvertItem = require('AdvertItem');
cc.Class({
    extends: BasePop,

    properties: {
        TableCell: cc.Prefab,
        ScrollView: cc.ScrollView,
        initNode: cc.Node,
        ShareView: cc.Prefab,

        Page1: cc.Sprite,
        Page2: cc.Sprite,
        Page3: cc.Sprite,

        advertItem: cc.Prefab,
        pageView: cc.PageView,
        pageViewContent: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("FindView.OnLoad2");

        this._super();
        this.onSendReqFoundTable(0, 50);

        //cc.log(window.US_REQ_BANNER_LIST_CMD_ID);
        //MessageFactory.createMessageReq(window.US_REQ_BANNER_LIST_CMD_ID).send();
    },

    onSendReqFoundTable: function onSendReqFoundTable(nStart, nTotal) {
        var data = {
            start: nStart,
            total: nTotal
        };
        MessageFactory.createMessageReq(window.US_REQ_FOUND_TABLE_CMD_ID).send(data);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;

        if (msg.popView == "GamblingHouseCell") {
            if (msg.btn == "enterRoom") {
                this.dismiss();
            } else if (msg.btn == "winxinShared") {

                cc.log("FindView.onSceneMsg but=" + msg.btn);

                var shareView = cc.instantiate(this.ShareView);
                cc.director.getScene().addChild(shareView);
                var winSize = cc.director.getWinSize();
                shareView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            }
        }
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("FindView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;

        switch (cmd) {
            case US_RESP_FOUND_TABLE_CMD_ID:
                this.onFoundTableMsg(msg);
                break;

            case US_RESP_BANNER_LIST_CMD_ID:
                this.onShopListMsg(msg);
                break;
        }
    },

    onShopListMsg: function onShopListMsg(msg) {

        cc.log("onShopListMsg2");

        /*
           if(msg.code == SocketRetCode.RET_SUCCESS)
           {
               //cc.log(msg.bannerlist);
                 //this.updateBannerList(msg.bannerlist);
           }
           */
    },

    addAdvertItem: function addAdvertItem(info, index) {
        //jumpurl pic
        var winSize = cc.director.getWinSize();
        var advertItem = cc.instantiate(this.advertItem);
        this.pageView.addPage(advertItem);
        var winSize = cc.director.getWinSize();
        advertItem.setPosition(cc.p(winSize.width / 2 + winSize.width * index, 0));
        advertItem.getComponent('AdvertItem').updateAdverItem(info);
    },

    updateBannerList: function updateBannerList(bannerlist) {
        this.pageView.removeAllPages();

        for (var index = 0; index < bannerlist.length; index++) {
            this.addAdvertItem(bannerlist[index], index);
        }

        //this.getSpriteFrame2("http://manage.aqddp.cn/getpic.php?url=http://manage.aqddp.cn/files/banner1.jpg");
    },

    getSpriteFrame2: function getSpriteFrame2(url, successCb, failureCb, target, otherSender) {
        //url = this.kyHelper + url;


        //cc.log(page1);

        var xhr = new XMLHttpRequest();

        var self = this;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;

                var img = BASE64.decoder(response);

                //cc.log("img=", img);

                var text = new Uint8Array(response, 0, response.length);

                var img = new Image();
                img.src = BASE64.decoder(response);

                var texture = new cc.Texture2D();
                texture.initWithImage(img); //cc.Texture2D.SRC_ALPHA, 1, 1, cc.size(1080, 300));
                texture.handleLoadedTexture();

                var newframe = new cc.SpriteFrame(texture);
                self.Page1.spriteFrame = newframe;

                // if (successCb != null) {
                //     successCb.apply(target, [newframe, otherSender]);
                // }
            } else {
                    // if(failureCb != null)
                    // {
                    //     failureCb.apply(target);
                    // }
                }
        };

        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    },

    onFoundTableMsg: function onFoundTableMsg(msg) {
        if (msg.list.length === 0) {
            ToastView.show("暂未发现房间");
            return;
        }

        if (this.initNode != null && this.initNode != undefined) this.initNode.active = false;

        var height = 0;
        for (var index = 0; index < msg.list.length; index++) {
            var TableCell = cc.instantiate(this.TableCell);
            this.ScrollView.content.addChild(TableCell);
            height = TableCell.getContentSize().height;
            TableCell.setPosition(cc.p(0, -TableCell.getContentSize().height / 2 - TableCell.getContentSize().height * index));
            TableCell.getComponent("GamblingHouseCell").updateRoomInfo(msg.list[index]);
        }

        if (height * (msg.list.length + 1) > this.ScrollView.content.height) {
            this.ScrollView.content.height = height * (msg.list.length + 1);
        }
    },

    callbackScrollView: function callbackScrollView(scrollview, eventType, customEventData) {
        cc.log("FindView ," + eventType + "," + customEventData);
        if (eventType === cc.ScrollView.EventType.SCROLL_TO_TOP) {} else if (eventType === cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {}
    }
});