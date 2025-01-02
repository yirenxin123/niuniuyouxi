var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ProduceCell = require('ProduceCell');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
cc.Class({
    extends: BasePop,

    properties: {
        GoldScrollView : cc.ScrollView,
        DiamondScrollView : cc.ScrollView,
        ProduceCell_0 : cc.Prefab,
        ProduceCell_1 : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        MessageFactory.createMessageReq(window.US_REQ_SHOP_CONF_CMD_ID).send();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /*********************Network***************************/
    onMessage : function (event) {
        cc.log("ShopView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_SHOP_CONF_CMD_ID:
                this.onShopConfMsg(msg);
                break;
        }
    },
/*
* {"cmd":131210,"seq":1,"uid":10688,"code":0,"desc":"执行成功","param":{
* "goldlist":[
*   {"type":1,"prop":620,"cost":60,"name":"福袋","desc":"含600牛币,额外送20"},
*   {"type":2,"prop":3200,"cost":300,"name":"聚宝盆","desc":"含3000牛币,额外送200"},
*   {"type":3,"prop":13800,"cost":1280,"name":"财神爷","desc":"含12800牛币,额外送1000"}
*  ],
*  "diamondlist":[
*   {"type":1,"prop":60,"cost":6,"name":"60钻石","desc":"\"\""},
*   {"type":2,"prop":300,"cost":30,"name":"300钻石","desc":"\"\""},
*   {"type":3,"prop":1280,"cost":128,"name":"1280钻石","desc":"\"\""},
*   {"type":4,"prop":3280,"cost":328,"name":"3280钻石","desc":"\"\""},
*   {"type":5,"prop":6180,"cost":618,"name":"6180钻石","desc":"\"\""}]}}
* */
    onShopConfMsg : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            this.updateGoldList(msg.goldlist);
            this.updateDiamondList(msg.diamondlist);
        }
    },
    
    updateGoldList : function (goldlist) {

        this.GoldScrollView.content.removeAllChildren(true);
        for(var index = 0;index < goldlist.length;index++)
        {
            var gold = cc.instantiate(this.ProduceCell_0);
            this.GoldScrollView.content.addChild(gold);
            gold.setPosition(cc.p(0,0 - gold.getContentSize().height*(index + 0.5)));
            gold.getComponent("ProduceCell").setProduceData(0,goldlist[index]);
        }
    },

    updateDiamondList : function (diamondlist) {

        this.DiamondScrollView.content.removeAllChildren(true);
        for(var index = 0;index < diamondlist.length;index++)
        {
            var Diamond = cc.instantiate(this.ProduceCell_0);
            this.DiamondScrollView.content.addChild(Diamond);
            Diamond.setPosition(cc.p(0,0 - Diamond.getContentSize().height*(index + 0.5)));
            Diamond.getComponent("ProduceCell").setProduceDataDiamond(1, diamondlist[index]);
        }
    },

    callBackBtn : function (event , CustomEventData) {
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },
    
    callBackBtnToggle : function (toggle,CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(CustomEventData == 1)
        {
            this.GoldScrollView.node.active = true;
            this.DiamondScrollView.node.active = false;
        }
        else
        {
            this.GoldScrollView.node.active = false;
            this.DiamondScrollView.node.active = true;
        }
    },
    
    initScrollView : function (type) {
        
    },
});
