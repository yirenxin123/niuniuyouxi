var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        m_iMinCarry : 100,
        m_iMaxCarry : 1000,
        CurCoin     : cc.Label,  //已经带入
        MyGold      : cc.Label,  //身上金币
        CarryRange  : cc.Label,  //最高带入
        TotalCoin    : cc.Label,  //总带入上线
        curCarry    : cc.EditBox,

        m_iTimeOut  : 0,
        TimeLabel   : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
    },

    setMinAndMax : function (min, max, total) {
        cc.log("Bullfight_CarryView.setMinAndMax,min = " + min + ",max = " + max, " total=", total);
        this.m_iMinGold        = min;
        this.m_iMaxGold        = max;
        this.TotalCoin.string  = total;
        this.CurCoin.string    = GamePlayer.getInstance().TotalCarry;
        this.MyGold.string     = GamePlayer.getInstance().gold;
        this.CarryRange.string = "(" + min + "~" + max + ")";
    },

    callbackBtn : function (event , CustomEventData) {
        var btnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        
        cc.log("Bullfight_CarryView.callbackBtn,btnName = " + btnName);
        if(btnName == "BtnClose")
        {
            this.dismiss();
        }
        else if(btnName == "BtnSure")
        {
            var coin = parseInt(this.curCarry.string);
            if (coin < this.m_iMinGold)
            {
                ToastView.show("您携带的牛友币不能小于" + this.m_iMinGold);
                return;
            }
            if (coin > this.m_iMaxGold)
            {
                ToastView.show("您携带的牛友币不能大于" + this.m_iMaxGold);
                return;
            }
            if (coin > GamePlayer.getInstance().gold) {
                ToastView.show("您拥有的牛友币不足，请前往商城购买");
                return;
            }
            var data = {
                coin : parseInt(this.curCarry.string),
            };
            MessageFactory.createMessageReq(window.US_REQ_CARRY_COIN_CMD_ID).send(data);

            this.dismiss();
        }
    },

    setCarryTime : function (time) {
        this.m_iTimeOut = time;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.removeSelf()));
        this.schedule(this.updateTimeOut,1.0);
    },

    updateTimeOut : function () {

        this.m_iTimeOut-- ;
        if(this.m_iTimeOut < 0)
        {
            this.unschedule(this.updateTimeOut);
            this.dismiss();
        }
        this.TimeLabel.string = this.m_iTimeOut + "s";
    },
});
