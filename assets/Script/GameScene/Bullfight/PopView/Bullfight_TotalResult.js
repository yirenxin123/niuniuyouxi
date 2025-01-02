var Bullfight_PlayerCell = require('Bullfight_PlayerCell');
var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var UtilTool = require('UtilTool');
var GameSystem   = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        LabelTitle: cc.Label,
        LabelCoin : cc.Label,
        LabelRoundnum : cc.Label,
        LabelwinMax : cc.Label,
        LabelallCarry : cc.Label,
        scrollView : cc.ScrollView,
        PlayerCell : cc.Prefab,
        Head : cc.Sprite,
        BtnShare : cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        this.initBaseData();
        //this.setGameData();
        if(GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT)
        {
            this.BtnShare.active = false;
        }
    },
    
    initBaseData : function () {
        this.coin = 0;
        this.roundnum = 0;
        this.winMax = 0;
        this.allCarry = 0;
        this.roomId = 0;
        this.ShareImagePath = "";
        this.Canvas = null;
    },
    
    
    callBackBtnClose : function () {
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.director.loadScene('HallScene');
    },

    callBackBtnShare : function () {
        var message = {
            popView : "Bullfight_TotalResult",
            btn : "BtnShare"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
            {tag:window.MessageType.SCENE_MSG,data:message}) ;

        // var self = this;
        // this.ShareImagePath = UtilTool.captureScreen("TotalResult.png",this.Canvas,function(filePath){
        //     var shareView = cc.instantiate(self.ShareView);
        //     self.node.addChild(shareView);
        //     shareView.setPosition(cc.p(0,0));
        //     var string = "游戏结算分享";
        //     shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE,filePath,"www.baidu.com");
        // });
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     *  Uid        int32 `json:"uid"`
     Coin       int64 `json:"coin"`
     PlayNum    int   `json:"playnum"`
     MaxWin     int   `json:"maxwin"`
     TotalCarry int64 `json:"totalcarry"`
     * */
    setGameData : function (msg, canvas) {
        this.Canvas = canvas;

        this.LabelTitle.string = "总结算(" + msg.privateid + ")";
        var scores = msg.Scores;
        var cellheight = 0;
        for (var index = 0;index < scores.length;index++)
        {
            var item = cc.instantiate(this.PlayerCell);
            item.setPosition(cc.p(0,-index*item.getContentSize().height - item.getContentSize().height/2));
            this.scrollView.content.addChild(item);

            if (scores[index].uid == GamePlayer.getInstance().uid)
            {
                this.coin     = scores[index].wincoin;
                this.roundnum = scores[index].playnum;
                this.winMax   = scores[index].maxwin;
                this.allCarry = scores[index].totalcarry;
            }

            cellheight = item.getContentSize().height;
            item.getComponent("Bullfight_TotalResultCell").updatePlayerScoreCell(scores[index].name,
                scores[index].totalcarry, scores[index].wincoin, 50);
        }

        if(scores.length*cellheight > this.scrollView.content.height)
        {
            this.scrollView.content.height = scores.length*cellheight;
        }
        this.updateMySelfInfo();

        //this.node.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(this.ShootScreen,this)));

    },

    updateMySelfInfo : function () {
        var winCoin = Number(this.coin);
        if (winCoin > 0)
        {
            this.LabelCoin.string  = "+" + winCoin;
            this.LabelCoin.node.color = cc.Color.RED;
        }
        else if (winCoin == 0) {
            this.LabelCoin.string     = winCoin;
            this.LabelCoin.node.color = new cc.Color(204, 160, 41, 255);
        }
        else
        {
            this.LabelCoin.string     = winCoin;
            this.LabelCoin.node.color = cc.Color.GREEN;
        }
        this.LabelRoundnum.string = this.roundnum;
        this.LabelwinMax.string = this.winMax;
        this.LabelallCarry.string = this.allCarry;
        UpdateWXHeadIcon(GamePlayer.getInstance().headurl,this.Head);
    },
});
