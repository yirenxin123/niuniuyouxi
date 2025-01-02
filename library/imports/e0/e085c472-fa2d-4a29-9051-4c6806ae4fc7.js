'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
*
* /桌子详情
 type US_RESP_TABLE_DETAIL_T struct {
 JsonHead
 RespHead
 Param string `json:"param"` //base64
 }
 type DETAIL_SEATER_T struct {
 Uid            uint32   `json:"uid"`
 Name           string   `json:"name"`
 HeadUrl        string   `json:"headurl"`
 Sex            int      `json:"sex"`
 Gold           int      `json:"gold"`
 Diamond        int      `json:"diamond"`
 Coin           int      `json:"coin"`      //现在身上带入的金币
 TotalCarryCoin int      `json:"total"`     //总带入金币
 WinCoin        int      `json:"win"`       //输赢多少金币
 SeatId         int8     `json:"seatid"`    //座位id
 Status         int      `json:"status"`    //桌上玩家状态
 CallType       int8     `json:"calltype"`  //抢庄类型
 MaxBetMul      int      `json:"maxbetmul"` //最大下注倍数
 BetMul         int      `json:"betmul"`    //下注倍数
 BhaveCard      bool     `json:"bhavecard"` //是否有牌
 BopenCard      bool     `json:"bopencard"` //是否开牌
 Cards          []uint16 `json:"cards"`     //牌数据
 BullType       int      `json::bulltype:`  //牛牛类型
 FinalCoin      int      `json:"finalcoin"` //这一局输赢结果
 }

 //进入桌子返回
 type SBF_DETAIL_TABLE_T struct {
 TableId    int32             `json:"tableid"`    //桌子ID
 TableName  string            `json:"name"`       //桌子名称
 GameType   int32             `json:"gametype"`   //桌子类型(闭牌抢庄,四张抢庄)
 MinAnte    int               `json:"minante"`    //最小下注
 MinCarry   int               `json:"mincarry"`   //最小带入
 LiveTime   int64             `json:"livetime"`   //桌子总时间
 RemainTime int64             `json:"remaintime"` //剩余时间
 Bstart     int8              `json:"bstart"`     //桌子是否开始
 Seats      int               `json:"seats"`      //座位数
 BullMul    []int32           `json:"bullmul"`    //倍率
 Bowner     int8              `json:"bowner"`     //是否是桌主
 Bsitdown   int8              `json:"bsitdown"`   //是否入座
 Tstatus    int               `json:"tstatus"`    //桌子状态
 Timeout    int               `json:"timeout"`    //桌子处于某个状态下的剩余时间
 RoundNum   int               `json:"roundnum"`   //当前第几手牌
 BankerUid  uint32            `json:"bankeruid"`  //庄家UID
 Seaters    []DETAIL_SEATER_T `json:"seaters"`    //桌位上的玩家信息
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_TableDetailRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        cc.log("Bullfight_TableDetailRespPacket,param = " + BASE64.decoder(msg.param));
        var json = JSON.parse(BASE64.decoder(msg.param));
        this.privateid = json.privateid;
        this.tableid = json.tableid;
        this.name = json.name;
        this.gametype = json.gametype;
        this.carrycoin = json.carrycoin;
        this.minante = json.minante;
        this.mincarry = json.mincarry;
        this.maxcarry = json.maxcarry;
        this.livetime = json.livetime;
        this.remaintime = json.remaintime;
        this.bstart = json.bstart;
        this.seats = json.seats;
        this.bullmul = json.bullmul;
        this.bowner = json.bowner;
        this.bsitdown = json.bsitdown;
        this.tstatus = json.tstatus;
        this.timeout = json.timeout;
        this.roundnum = json.roundnum;
        this.bankeruid = json.bankeruid;
        this.seaters = json.seaters;
        this.totalcarry = json.totalcarry;
    };
}

module.exports = Bullfight_TableDetailRespPacket;