var MessageFactory     = require('MessageFactory');
var Bullfight_MultCell = require('Bullfight_MultCell');
var BasePop      = require('BasePop');
var ToastView    = require('ToastView');
var GamePlayer   = require('GamePlayer');
var MusicMgr     = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem   = require('GameSystem');
var ProgressSlider = require('ProgressSlider');

cc.Class({
    extends: BasePop,

    properties: {

        scrollViewRule : cc.ScrollView,
        scrollViewMult : cc.ScrollView,
        MultCell : [Bullfight_MultCell],
        TitleName: cc.Label,
        RoomName : cc.EditBox,
        BtnDiamondOn     : cc.Sprite,
        BtnDiamondOff    : cc.Sprite,
        BtnDiamondOnNum  : cc.Label,
        BtnDiamondOffNum : cc.Label,
        CarryData        : [ProgressSlider],
        minBetNode : cc.Node,
        timeNode : [cc.Node],
        ClubCreateNode : cc.Node,
        RoomCardSetting : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.initPopData();
    },

    initPopData : function () {
        this.gameMode     = 101;
        this.ownerControl = 1;
        this.bankerMode   = 1;
        this.minBet  = 1;
        this.time    = 10;
        this.persons = 6;
        this.CardTypeMult = [1,1,1,1,1,1,1,1,2,3,0,4,0,0,0,0,0];
        this.scrollViewMult.node.active = false;
        this.RoomName.string = GamePlayer.getInstance().name;
        this.createType = 0; //默认私人创建  1: 俱乐部创建
        this.clubid     = 0;
        this.clublevel  = 0;  //个人level=0
        this.RoomLevel = 1;

        this.gameround = 10;
        this.specCard = 0;
    },


    setRoomCardView : function () {
        this.ClubCreateNode.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.log("stop event");
            event.stopPropagation();

        }.bind(this));
        this.RoomCardSetting.active = true;
        this.RoomLevel = 2;
    },

    switchBtnGoldDiamond : function () {
        var liveTime    = 60*Number(this.time);
        // var goldCost    = GameSystem.getInstance().calcGoldCost(liveTime, this.minBet);
        var goldDiamond = GameSystem.getInstance().calcDiamondCost(liveTime, Number(this.clublevel));

        if ( goldDiamond <= GamePlayer.getInstance().diamond) {
            this.BtnDiamondOn.node.active  = true;
            this.BtnDiamondOnNum.string    = goldDiamond;
            this.BtnDiamondOff.node.active = false;
        } else {
            this.BtnDiamondOn.node.active  = false;
            this.BtnDiamondOff.node.active = true;
            this.BtnDiamondOffNum.string    = goldDiamond;
        }
    },

    
    setClubId : function (clubid, clublevel) {
        this.clubid    = clubid;
        this.clublevel = clublevel;
        if (this.clubid > 0) {
            this.TitleName.string = "俱乐部开局";
            this.time    = 30;
            this.CarryData[0].setMinAndMax(100, 1000);
            this.CarryData[1].setMinAndMax(200, 2000);
            if (clublevel == 0) {
                clublevel = 1;
            }
            this.CarryData[2].setMinAndMax(600, 2000 * 2 * clublevel);
        } else {
            this.CarryData[0].setMinAndMax(100, 300);
            this.CarryData[1].setMinAndMax(200, 600);
            this.CarryData[2].setMinAndMax(600, 1200);
        }

        for(var index = 0;index < this.MultCell.length; index++)
        {
            this.MultCell[index].setClubCreate(this.clubid != 0);
        }

        this.minBetNode.active = (this.clubid != 0);
        this.timeNode[0].active = (this.clubid == 0);
        this.timeNode[1].active = (this.clubid != 0);

        this.switchBtnGoldDiamond();
    },

    callbackBtnLabel : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnLabel,CustomEventData =" + CustomEventData);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(CustomEventData == 1)
        {
            for(var index = 0;index < this.MultCell.length; index++)
            {
                this.CardTypeMult[index] = Number(this.MultCell[index].getCurMult());
            }
            this.scrollViewRule.node.active = true;
            this.scrollViewMult.node.active = false;
        }else{
            if(this.clubid == 0)
                ToastView.show("非俱乐部创建牌局无法修改倍率");
            this.scrollViewRule.node.active = false;
            this.scrollViewMult.node.active = true;
        }
    },


    callbackBtnMode : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnLabel,CustomEventData =" + CustomEventData);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (CustomEventData == 1)
        {
            this.bankerMode = 1;
        } else if (CustomEventData == 2) {
            this.bankerMode = 2;
        } else {
            ToastView.show("敬请期待...");
        }
    },

    callbackGameRound: function(event, CustomEventData) {
        // if (CustomEventData == 1) {
        //     this.gameround = 10;
        // } else if (CustomEventData == 2) {
        //     this.gameround = 20;
        // } else if (CustomEventData == 3) {
        //     this.gameround = 30;
        // }
        this.gameround = Number(CustomEventData);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("callbackGameRound, CustomEventData=", CustomEventData, " gameround=", this.gameround);
    },

    callbackSpecCardType: function(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackSpecCardType, this.specCard =" + this.specCard);
        if (this.specCard == 0) {
            this.specCard = 0;
            this.CardTypeMult = [1,1,1,1,1,1,1,1,2,3,0,4,0,0,0,0,0];
        } else {
            this.specCard = 1;
            this.CardTypeMult = [1,1,1,1,1,1,1,1,2,3,0,4,5,5,5,5,5];
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackFlowerCard: function(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackFlowerCard, CustomEventData =" + CustomEventData);
        if (CustomEventData == 1) {
            this.FlowerCard = 1;
        } else if (CustomEventData == 2) {
            this.FlowerCard = 0;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackOwnerControl : function (event) {
        cc.log("Bullfight_CreateRoom.callbackGameMode");
        if (this.ownerControl == 1) {
            this.ownerControl = 0;
        } else {
            this.ownerControl = 1;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackBankerMode : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBankerMode,CustomEventData =" + CustomEventData);
        this.bankerMode = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackMinBet : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackMinBet,CustomEventData =" + CustomEventData);
        this.minBet = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackTime : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackTime,CustomEventData =" + CustomEventData);
        this.time = CustomEventData;
        this.switchBtnGoldDiamond();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackPersons : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackPersons,CustomEventData =" + CustomEventData);
        this.persons = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackCreateRoom : function (event , CustomEventData) {

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if(this.RoomLevel == 2)
        {
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

            var data = {
                control   : Number(this.ownerControl),
                paymode   : 1, //付费模式 (默认房卡)
                gametype  : Number(this.bankerMode),//闭牌抢庄,四张抢庄(二选一)
                name      : GamePlayer.getInstance().name,
                mixante   : 1, //最小下注
                gameround : this.gameround,
                flowercard: this.FlowerCard, //是否有花牌
                seats     : 6,//座位数
                bullmul   : this.CardTypeMult,//从无牛开始，传一个数组
            };

            cc.log("callbackCreateRoom : data=", data);

            var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid    : 0,
                clublevel : 0,
                gameid    : Number(this.gameMode),
                gamelevel : 2,
            };

            if(createRoom) {
                createRoom.send(data, type);
            }

            this.dismiss();
            return ;
        }

        if(this.scrollViewMult.node.active)
        {
            for(var index = 0;index < this.MultCell.length;index++)
            {
                this.CardTypeMult[index] = Number(this.MultCell[index].getCurMult());
            }
        }
        if(this.RoomName.string == "")
        {
            ToastView.show("房间名不能为空！");
            return ;
        }

        cc.log("callbackCreateRoom : CustomEventData=", CustomEventData);
        var eventData = Number(CustomEventData);
        if (eventData == 3) {
            ToastView.show("您的钻石不够,请去商城购买");
            return;
        } else if (eventData == 4) {
            ToastView.show("您的金币不够,请去商城购买");
            return;
        }

        var data = {
            control  : Number(this.ownerControl),
            paymode  : eventData, //付费模式 (默认钻石)
            gametype : Number(this.bankerMode),//闭牌抢庄,四张抢庄(二选一)
            mixante  : Number(this.minBet), //最小下注
            livetime : 60*Number(this.time),//桌子使用时间(秒)
            name     : this.RoomName.string,//桌子名称
            seats    : Number(this.persons),//座位数
            bullmul  : this.CardTypeMult,//从无牛开始，传一个数组
            mincarry : this.CarryData[0].CurCarryNum,
            maxcarry : this.CarryData[1].CurCarryNum,
            totalcarry : this.CarryData[2].CurCarryNum,
        };

        if (data.mincarry > data.maxcarry) {
            data.maxcarry = data.mincarry
        }

        if (data.maxcarry > data.totalcarry) {
            data.totalcarry = data.maxcarry
        }

        cc.log("callbackCreateRoom : seats=", data.seats);

        if(this.clubid === 0)
        {
            var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid : (this.clubid === 0 ? 0 : this.clubid),
                clublevel : (this.clubid === 0 ? 0 : this.clublevel),
                gameid : Number(this.gameMode),
                gamelevel : 1,
            };
            if(createRoom) {
                createRoom.send(data, type);
            }
        }
        else
        {
            var createRoom = MessageFactory.createMessageReq(window.CLUB_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid : (this.clubid === 0 ? 0 : this.clubid),
                clublevel : (this.clubid === 0 ? 0 : this.clublevel),
                gameid : Number(this.gameMode),
                gamelevel : 1,
            };
            if(createRoom) {
                createRoom.send(data,type);
            }
        }
        this.dismiss();
    },
    callbackBtnClose : function (event , CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnClose,CustomEventData =" + CustomEventData);
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },
});
