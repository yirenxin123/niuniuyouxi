var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var GamePlayer = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var AlertView = require('AlertView');
var HttpManager = require('HttpManager');
var WeChatApi = require('WeChatApi');
var GameSystem = require('GameSystem');
cc.Class({
    extends: cc.Component,

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

        ProduceImg : cc.Sprite,
        ProduceName : cc.Label,
        ProducePrice : cc.Label,
        ProduceDesc : cc.Label,
        MoneyLabel  : cc.Label,
        ProducePriceImg : cc.Sprite,
        ProduceGoldFrame : [cc.SpriteFrame],
        ProduceDiamondFrame : [cc.SpriteFrame],
        PropFrame : [cc.SpriteFrame],
        Diamond : cc.Sprite,
        ReferralCodeView : cc.Prefab,
        ActivityFlag : cc.Sprite,
        ActivityFlagFrame : [cc.SpriteFrame],

    },

    // use this for initialization
    onLoad: function () {
        //this.initData();
    },

    initData :function () {
        this.ProduceType = 0;  //0 gold 1 diamond
        this.Price = 0;
        this.Name = "";
        this.id = 0;
        this.msg = null;
    },
    
    setProduceData : function (type,msg) {
        this.msg = msg;
        this.ProduceType = type;
        this.setProduceName(msg.name);
        this.setProducePrice(msg.cost);
        this.setProduceTypeAndImg(type,msg.type);
        this.ProduceDesc.string = msg.desc;
        this.MoneyLabel.node.active = false;
    },

    setProduceDataDiamond : function (type, msg) {
        this.msg = msg;
        this.ProduceType = type;
        this.setProduceName(msg.name);
        this.MoneyLabel.node.active = true;
        this.MoneyLabel.string = "售价：¥" + msg.cost;
        this.Price = msg.cost;
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT
            && GameCallOC.getInstance().checkIsAble())
        {
            this.ProduceDesc.node.active  = false;
        }
        else
        {
            this.ProduceDesc.node.active  = true;
            this.ProduceDesc.string = msg.desc;
        }

        this.ProducePrice.node.active = false;
        this.Diamond.node.active      = false;
        this.setProduceTypeAndImg(type, msg.type);
        this.id = msg.id;
    },

    setProduceName : function (name) {
        this.Name = name;
        this.ProduceName.string = name;
    },

    setProducePrice :function (price) {
        this.Price = price;
        this.ProducePrice.string = price;
    },
    
    setProduceTypeAndImg :function (type,index) {

        if(type == 0)
        {
            this.ProduceImg.spriteFrame = this.PropFrame[index-1];
        }
        else
        {
            this.ProduceImg.spriteFrame = this.ProduceDiamondFrame[index-1];
        }

        var activity = 0;
        if(type == 1 && (index == 4 || index == 5))
            activity = 1;
        this.setActivityFlag(type,activity);
    },
    
    setActivityFlag : function (type,activity) {
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT
            && GameCallOC.getInstance().checkIsAble())
        {
            this.ActivityFlag.node.active = false;
            return;
        }

        if(activity > 0)
        {
            this.ActivityFlag.node.active = true;
        }
        else
        {
            this.ActivityFlag.node.active = false;
        }

    },
    
    createReferralCodeView : function () {
        var winSize = cc.director.getWinSize();
        var referralCodeView = cc.instantiate(this.ReferralCodeView);
        cc.director.getScene().addChild(referralCodeView);
        referralCodeView.setPosition(cc.p(winSize.width/2, winSize.height/2));
    },
    
    callBtnBuy : function () {
        cc.log("ProductCell.callBtnBuy");
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(this.ProduceType == 1)
        {
            if(GameSystem.getInstance().productid == 2)
            {
                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                },"确定");

                var str = "请联系微信客服：["  + GameSystem.getInstance().weixincs + "]充值";
                alert.show(str ,AlertViewBtnType.E_BTN_CLOSE);
            }
            else
            {
                if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT
                    && GameCallOC.getInstance().checkIsAble()) {
                    GameCallOC.getInstance().payAppstore(this.msg.id,GamePlayer.getInstance().uid);
                }
                else
                {
                    if(GameSystem.getInstance().referralCode == 0)
                    {

                        var self = this;
                        var alert = AlertView.create();
                        alert.setPositiveButton(function () {
                            self.createReferralCodeView();
                        },"绑定");

                        var str = "首次购买钻石请绑定推广人";
                        alert.show(str ,AlertViewBtnType.E_BTN_CLOSE);
                        return ;
                    }
                    else
                    {
                        WeChatApi.getInstance().weChatPay(this.msg.id,GamePlayer.getInstance().uid);
                    }

                }
            }


        }
        else
        {
            var self = this;
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                var data = {
                    type : self.msg.type
                };
                MessageFactory.createMessageReq(US_REQ_EXCHANGE_GOLD_CMD_ID).send(data);
            },"兑换");
            alert.setNegativeButton(function () {

            },"取消");

            var str = "您是否确定消耗" + this.msg.cost + "个钻石兑换" + this.msg.name + "(" + this.msg.desc + ")";
            alert.show(str ,AlertViewBtnType.E_BTN_CANCLE);

        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
