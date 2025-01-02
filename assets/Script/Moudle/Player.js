/**
 * Created by shrimp on 17/2/22.
 */

function Player() {
    this.uid        = 0;
    this.name       = "";
    this.headurl    = "";
    this.sex        = 0;
    this.gold       = 0; //身上金币
    this.diamond    = 0; //身上钻石
    this.coin       = 0; //携带金币
    this.seatid     = -1;//没有坐下
    this.status     = 0;
    this.bowner     = 0;
    this.winGold    = 0;
    this.TotalCarry = 0;
    this.TotalRound = 0;
    this.TotalTable = 0;
    this.fileId     = "";
    this.calltype   = 0;  //叫庄类型
    this.bBanker    = 0;  //是否是庄家
    this.betcoinmul = 0;  //下注倍数
    this.bOpenCard  = 0;  //是否看牌
    this.bulltype   = 0;
    this.cards      = [];
    this.finalcoin  = 0;
    this.roomcard   = 0; // 房卡数量
}

Player.setSeatId = function (seatid) {
    cc.log("Palyer.setSeadId,seatid = " + seatid);
    this.seatid = seatid;
}

module.exports = Player;