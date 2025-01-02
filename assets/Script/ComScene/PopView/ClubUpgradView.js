var BasePop        = require('BasePop');
var MusicMgr       = require('MusicMgr');
var Audio_Common   = require('Audio_Common');
var GameSystem     = require('GameSystem');
var GamePlayer     = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var ToastView      = require('ToastView');
var UtilTool       = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        TipsLabel        : cc.Label, //提示
        LevelNum         : cc.Label, //等级
        PersonCurCount   : cc.Label, //当前等级人数
        PersonTargetCount: cc.Label, //目标等级人数
        TableCurCount    : cc.Label, //当前桌子人数
        TableTargetCount : cc.Label, //目标桌子人数
        DiamondCost      : cc.Label,
        CurDiamond       : cc.Label,
        BtnAdd           : cc.Button,
        BtnSub           : cc.Button,

        BtnSpriteFrame   : [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        this._super();

        this.showMaxClubInfo();
        this.showCurClubInfo();
        this.showCurDiamond();
        this.showBtnSprite(GamePlayer.getInstance().CurClubInfo.level);
    },

    // {"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    // {"level":2,"livetime":30,"diamond":1000, "maxpeople":50, "maxtable":3},
    // {"level":3,"livetime":30,"diamond":4000, "maxpeople":100,"maxtable":4},
    // {"level":4,"livetime":30,"diamond":10000,"maxpeople":200,"maxtable":9}
    getMaxLevelConf :function () {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        var level  = 1;
        var index = 0;
        for (var i = 0; i < list.length; i++) {
            if (level < list[i].level) {
                level = list[i].level;
                index = i;
            }
        }
        return list[index];
    },

    getCurLevelInfo : function (level) {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        for (var i = 0; i < list.length; i++) {
            if (level == list[i].level) {
                return list[i];
            }
        }
        return list[0];
    },

    showMaxClubInfo : function () {
        var info = this.getMaxLevelConf();
        this.TipsLabel.string = "俱乐部上限等级3级，有效期为15天，最高上限为" + info.maxpeople
                                + "人，同时创建" + info.maxtable + "张牌桌";
        this.PersonTargetCount.string = info.maxpeople;
        this.TableTargetCount.string  = info.maxtable;
    },

    showCurClubInfo : function () {
        var curClub = GamePlayer.getInstance().CurClubInfo;
        var curInfo = this.getCurLevelInfo(curClub.level);
        this.LevelNum.string       = curInfo.level;
        this.PersonCurCount.string = curInfo.maxpeople;
        this.TableCurCount.string  = curInfo.maxtable;
        this.DiamondCost.string    = curInfo.diamond;
    },

    showBtnSprite : function (level) {
        if (level == 1 ) {
            this.BtnSub.interactable = false;
        } else {
            this.BtnSub.interactable = true;
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        }

        if (level == 4) {
            this.BtnAdd.interactable = false;
        } else {
            this.BtnAdd.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        }
    },

    showCurDiamond : function () {
        this.CurDiamond.string = "拥有钻石: " + GamePlayer.getInstance().diamond;
    },


    onMessage : function (event) {
        var msg = event.data;
        var cmd = msg.cmd;
        cc.log("ClubUpgradeView.onMessage cmd=", msg.cmd, " window.CLUB_RESP_MODIFY_INFO_CMD_ID=", window.CLUB_RESP_MODIFY_INFO_CMD_ID);
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.updateUserDiamond(msg);
                break;
        }
    },

    updateUserDiamond: function (msg) {
        cc.log("ClubUpgradeView.updateUserDiamond");
        GamePlayer.getInstance().gold    = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        this.showCurDiamond();
    },

    // ClubId  int    `json:"clubid"`
    // Status  int    `json:"status"`
    // Name    string `json:"name"`
    // HeadUrl string `json:"headurl"`
    // Address string `json:"address"`
    // Intro   string `json:"intro"`
    // Level   int    `json:"level"`
    // EndTime int64  `json:"endtime"`
    onModifyInfoMsg : function (msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS ) {
            cc.log("ClubUpgradeView.onModifyInfoMsg code=", msg.code, " endtime=", msg.param.endtime);
            GamePlayer.getInstance().CurClubInfo.level     = Number(msg.param.level);
            GamePlayer.getInstance().CurClubInfo.endtime   = msg.param.endtime;
            var info = this.getCurLevelInfo(msg.param.level);
            cc.log("ClubUpgradeView.onModifyInfoMsg  info=", info);

            GamePlayer.getInstance().CurClubInfo.maxmember = info.maxpeople;

            ToastView.show("升级成功: " + UtilTool.getFormatDataDetail(GamePlayer.getInstance().CurClubInfo.endtime) + "到期", 2);
            this.getUserDetail();

        } else {
            ToastView.show(msg.desc);
        }
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubUpgradeView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(BtnName == "BtnClose") {
            this.dismiss();
            var message = {
                popView : "ClubUpdradeView",
                btn     : "BtnClose",
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                {tag:window.MessageType.SCENE_MSG, data:message});

        } else if(BtnName == "BtnUpgrade") {
            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnUpgrade level=", level);

            var info = this.getCurLevelInfo(level);
            if ( info.diamond > GamePlayer.getInstance().diamond) {
                ToastView.show("您钻石不足,请去商城购买");
                return;
            }

            cc.log("ClubSetView.callBackBtn endtime=", GamePlayer.getInstance().CurClubInfo.endtime);

            var info = GamePlayer.getInstance().CurClubInfo;
            var data = {
                clubid  : info.clubid,
                headurl : "",
                intro   : "",
                address : "",
                level   : level,
            };
            MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
        } else if(BtnName == "BtnSub") {

            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnSub level=", level);

            if (level == 1) {
                return;
            }

            level = level - 1;

            var info = this.getCurLevelInfo(level);
            this.LevelNum.string          = level;
            this.PersonTargetCount.string = info.maxpeople;
            this.TableTargetCount.string  = info.maxtable;
            this.DiamondCost.string       = info.diamond;
            this.showBtnSprite(level);

        } else if(BtnName == "BtnAdd") {

            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnAdd level=", level);

            if (level == 4) {
                return;
            }

            level = level + 1;

            var info = this.getCurLevelInfo(level);
            this.LevelNum.string          = level;
            this.PersonTargetCount.string = info.maxpeople;
            this.TableTargetCount.string  = info.maxtable;
            this.DiamondCost.string       = info.diamond;
            this.showBtnSprite(level);
        }
    },
});
