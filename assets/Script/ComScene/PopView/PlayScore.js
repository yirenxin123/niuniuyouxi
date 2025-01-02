cc.Class({
    extends: cc.Component,

    properties: {
        UserName  : cc.Label,
        Uid       : cc.Label,
        CarryCoin : cc.Label,
        ZhanGuo   : cc.Label,
        WinScore  : cc.Label,
        Head : cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },

    //"uid":11279,"name":"游客11279","headurl":" ","carrycoin":4000,"wincoin":-954
    setScoreInfo : function (msg) {
        UpdateWXHeadIcon(msg.headurl,this.Head);

        this.Uid.string       = msg.uid;
        this.UserName.string  = msg.name;
        this.CarryCoin.string = "带入" + msg.carrycoin;

        var coin = msg.carrycoin + msg.wincoin;
        this.ZhanGuo.string   = "战果" + coin;

        if (msg.wincoin > 0)
        {
            this.WinScore.string = "+" + msg.wincoin;
        }
        else if (msg.wincoin == 0) {
            this.WinScore.string     = msg.wincoin;
            this.WinScore.node.color = new cc.Color(204, 160, 41, 255);
        }
        else
        {
            this.WinScore.string     = msg.wincoin;
            this.WinScore.node.color = cc.Color.GREEN;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
