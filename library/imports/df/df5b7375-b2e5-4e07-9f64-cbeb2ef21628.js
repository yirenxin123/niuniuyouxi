"use strict";

/**
 * Created by shrimp on 17/2/22.
 */

function GameSystemManager() {
    this.bClientHotUpdate = false;
    this.defaultKey = "xa`129-w2310u!@#$^&*(!hzsx&*32#@";
    this.bLogin = true;
    this.bFirstInHall = true; //是否第一次进入大厅
    this.webSocketUrl = "";
    this.backWebSocketUrl = "";
    this.userkey = "";
    this.aesKey = new Uint8Array();
    this.iv = [100, 22, 245, 214, 157, 96, 77, 82, 1, 37, 121, 90, 47, 65, 54, 63];
    this.productid = 3;
    this.version = 1015;
    // add by jackyu
    this.VolumeState = 0;

    this.referralCode = 0;
    this.ledlist = null;

    this.VerStatusType = cc.Enum({
        VERSION_TYPE_TEST: 1, //测试
        VERSION_TYPE_AUDIT: 2, //审核
        VERSION_TYPE_OPERATION: 3 });
    this.VerStatus = this.VerStatusType.VERSION_TYPE_TEST;

    this.clienturl = ""; //客户端升级地址

    this.fileurl = ""; //文件地址

    this.weixincs = ""; //微信客服账号

    this.payurl = ""; //支付地址

    this.notice = {
        title: "",
        doc: "",
        writer: "",
        popup: 0,
        ismaintain: 0,
        time: 0
    };

    //this.routerUrl = "http://niuyouquan.bigbeargame.com:19191/";
    //this.routerUrl = "http://121.41.26.8:19191/";
    this.routerUrl = "http://120.26.81.151:19191/";

    this.logintype = 3;

    this.CustomLoginType = 0; //玩家选择登录类型

    this.bReloadInGame = false;

    this.gamesvcid = 0;

    this.tableid = 0;

    this.privateid = 0;

    this.EnterRoom = true;

    this.GameType = cc.Enum({
        GAME_TYPE_HALL: 0,
        GAME_TYPE_BULLFIGHT: 1
    });

    this.CurGameType = this.GameType.GAME_TYPE_HALL;

    this.BullFightTableCost = []; //开房间消耗

    this.superCost = 0; //超级抢庄消耗

    this.giftCost = []; //礼物消耗

    this.ClubUpgradeCost = []; //俱乐部升级

    this.NewMsgNum = false;

    this.roomLevel = 1;
}

//[{"type":1,"value":1800,"diamond":1,"gold":100},
// {"type":1,"value":3600,"diamond":2,"gold":200},
// {"type":1,"value":5400,"diamond":3,"gold":300},
// {"type":1,"value":7200,"diamond":4,"gold":400},
// {"type":1,"value":9000,"diamond":5,"gold":500},
// {"type":1,"value":10800,"diamond":6,"gold":600},
// {"type":2,"value":1,"diamond":1,"gold":100},
// {"type":2,"value":5,"diamond":2,"gold":200},
// {"type":2,"value":10,"diamond":3,"gold":300},
// {"type":2,"value":20,"diamond":4,"gold":400},
// {"type":2,"value":50,"diamond":5,"gold":500}]

GameSystemManager.prototype.calcGoldCost = function (liveTime, minAnte) {
    var costInfo;
    var timeCost = 1;
    var anteCost = 1;
    var count = 0;

    cc.log("calcGoldCost liveTime=", liveTime, " minAnte=", minAnte);

    for (var i = 0; i < this.BullFightTableCost.length; i++) {

        costInfo = this.BullFightTableCost[i];

        if (costInfo.type == 1 && costInfo.value == liveTime) {
            timeCost = costInfo.gold;
            count++;
            cc.log("calcGoldCost timeCost=", timeCost);
        } else if (costInfo.type == 2 && costInfo.value == minAnte) {
            anteCost = costInfo.gold;
            count++;
            cc.log("calcGoldCost anteCost=", anteCost);
        }

        if (count == 2) {
            break;
        }
    }
    cc.log("calcGoldCost totalCost=", timeCost + anteCost);
    return timeCost + anteCost;
};

// Time    int `json:"time"`    //单位秒
// Diamond int `json:"diamond"` //消耗钻石
// Level   int `json:"level`    //等级(level=0是)
GameSystemManager.prototype.calcDiamondCost = function (liveTime, clubLevel) {
    var costInfo;

    for (var i = 0; i < this.BullFightTableCost.length; i++) {
        costInfo = this.BullFightTableCost[i];
        if (costInfo.time == liveTime && costInfo.level == clubLevel) {
            cc.log("calcDiamondCost liveTime=", liveTime, " clubLevel=", clubLevel, " diamond=", costInfo.diamond);
            return costInfo.diamond;
        }
    }
    cc.log("calcDiamondCost liveTime=", liveTime, " clubLevel=", clubLevel, " diamond=0");
    return 0;
};

GameSystemManager.prototype.getCurrentSystemTime = function () {
    return new Date().getTime();
};

var GameSystem = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new GameSystemManager();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = GameSystem;