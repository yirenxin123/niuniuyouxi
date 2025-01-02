'use strict';

/**
 * Created by shrimp on 17/2/23.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
* type US_REQ_CREATE_TABLE_T struct {
 JsonHead
 ClubId        int    `json:"clubid"`                     //俱乐部id, 如果玩家创建，=0
 ClubLevel int    `json:"clublevel"`             //俱乐部level, 如果玩家创建，=0
 GameId      uint16 `json:"gameid"`             //服务器id (六人桌抢庄=101)
 GameLevel uint16 `json:"gamelevel"`     //游戏等级,暂时无
 Param          string `json:"param"`		      //base64之后的参数
 }
 //六人牛牛私人桌参数
 type SBF_PRIVATE_TABLE_PARAM_T struct {
 PayMode   int     `json:"paymode"`  //付费模式 (默认钻石)
 GameType  int32   `json:"gametype"` //闭牌抢庄,三张抢庄(二选一)
 MinAnte   int     `json:"mixante"`  //最小下注
 LiveTime  int64   `json:"livetime"` //桌子使用时间(秒)
 Seats     int8    `json:"seats"`    //座位数
 TableName string  `json:"name"`     //桌子名称
 BullMul   []int32 `json:"bullmul"`  //从无牛开始，传一个数组
 }
* */

function ClubCreateRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_CREATE_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg, type) {
        cc.log("CreateRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: type.clubid,
            clublevel: type.clublevel,
            gameid: type.gameid,
            gamelevel: type.gamelevel,
            param: BASE64.encoder(JSON.stringify(msg))
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubCreateRoomReqPacket;