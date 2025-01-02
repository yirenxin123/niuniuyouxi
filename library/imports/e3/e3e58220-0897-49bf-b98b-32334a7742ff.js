"use strict";

/**
 * Created by shrimp on 17/2/26.
 */
var MessageResp = require("MessageResp");

function EnterRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_ENTER_GAME_CMD_ID;
    this.tableid = 0;
    this.name = "";
    this.gametype = 0;
    this.mixante = 0;
    this.livetime = 0;
    this.remaintime = 0;
    this.bstart = 0;
    this.seats = 0;
    this.bullmul = [];
    this.bowner = 0;
    this.supercost = 0;
    this.giftcosts = [];
    this.seaters = "";
    //接收的数据
    this.onMessage = function (msg) {

        //{"cmd":6553602,"seq":18,"uid":10006,"code":0,"desc":"",
        // {"tableid":0,"name":"qweq","tstatus":0,"gametype":1,"minante":1,"mincarry":50,
        // "livetime":1800,"remaintime":1800,"bstart":0,"seats":6,"bullmul":[1,1,1,1,1,1,1,1,2,3,0,4,0,0,0,0],
        // "bowner":1,"bsitdown":0,"ustatus":0,"gold":10000,"diamond":9992,"seaters":[]}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;

        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;

        if (this.param != "" && this.param != undefined) {
            cc.log("EnterRoomRespPacket" + BASE64.decoder(msg.param));
            var json = JSON.parse(BASE64.decoder(msg.param));
            this.tableid = json.tableid;
            this.name = json.name;
            this.gametype = json.gametype;
            this.mixante = json.mixante;
            this.livetime = json.livetime;
            this.remaintime = json.remaintime;
            this.bstart = json.bstart;
            this.seats = json.seats;
            this.bullmul = json.bullmul;
            this.bowner = json.bowner;
            this.seaters = json.seaters;
            this.ustatus = json.ustatus;
            this.tstatus = json.tstatus;
            this.supercost = json.supercost;
            this.giftcosts = json.giftcosts;
            this.mincarry = json.mincarry;
            this.maxcarry = json.maxcarry;
            this.totalcarry = json.totalcarry;
        }

        /*
        * TableId    int32      `json:"tableid"`    //桌子ID
         TableName  string     `json:"name"`       //桌子名称
         GameType   int32      `json:"gametype"`   //桌子类型(闭牌抢庄,四张抢庄)
         MixAnte    int        `json:"mixante"`    //最小下注
         LiveTime   int        `json:"livetime"`   //桌子总时间
         RemainTime int        `json:"remaintime"` //剩余时间
         Bstart     int8       `json:"bstart"`     //桌子是否开始
         Seats      int8      `json:"seats"`       //座位数
         BullMul    []int32    `json:"bullmul"`    //倍率
         Bowner     int8       `json:"bowner"`     //是否是桌主
         Seaters    []SEATER_T `json:"seaters"`    //桌位上的玩家信息
        * */
    };
}

module.exports = EnterRoomRespPacket;