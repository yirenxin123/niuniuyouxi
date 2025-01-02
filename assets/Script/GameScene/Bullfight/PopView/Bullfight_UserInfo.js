var BasePop        = require('BasePop');
var MusicMgr       = require('MusicMgr');
var Audio_Common   = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer     = require('GamePlayer');
var GameSystem     = require('GameSystem');
var ToastView      = require('ToastView');

cc.Class({
    extends: BasePop,

    properties: {
        NickName   : cc.Label,
        PlayerUid  : cc.Label,
        Gold       : cc.Label,
        Diamond    : cc.Label,
        TableCount : cc.Label,
        RoundCount : cc.Label,
        GiftCost   : [cc.Label],
        SexSprite  : cc.Sprite,
        Head : cc.Sprite,
        SexFrame   : [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.player = null;
    },

    setPlayerInfo : function (player) {
        this.player = player;
        this.NickName.string   = player.name;
        this.PlayerUid.string  = player.uid;
        this.Gold.string       = player.gold;
        this.Diamond.string    = player.diamond;
        this.RoundCount.string = player.TotalRound; //总手数
        this.TableCount.string = player.TotalTable; //总局数
        UpdateWXHeadIcon(player.headurl,this.Head);

        cc.log("onSitDown player.TotalRound=", player.TotalRound, " player.TotalTable=", player.TotalTable)

        for (var i=0; i < this.GiftCost.length; i++) {
            this.GiftCost[i].string = GameSystem.getInstance().giftCost[i].Gold;
        }
        var sex = (player.sex - 1 > 0) ? (player.sex - 1) : 0;
        this.SexSprite.spriteFrame = this.SexFrame[sex];
    },

    callBackBtn : function(event ,CustomEventData)
    {
        var BtnName = event.target.getName();
        if(BtnName == "BtnClose")
        {
            this.dismiss();
        }
        else
        {
            if (GamePlayer.getInstance().seatid == -1)
            {
                ToastView.show("您没有坐下不能发送礼物");
                return
            }

            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
            var data = {
                touid : this.player.uid,
                kind : ChatType.E_CHAT_GIFT_KIND,
                type : Number(CustomEventData),
                text : "",
            };
            MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
            this.dismiss();
        }


    },
});
