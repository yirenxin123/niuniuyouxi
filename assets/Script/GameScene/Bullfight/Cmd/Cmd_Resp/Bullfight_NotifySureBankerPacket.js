/**
 * Created by shrimp on 17/3/5.
 */
/*
 type SBF_NOTIFY_CONFIRM_BANKER_T struct {
 JsonHead
 RespHead
 TableId  int32 `json:"tableid"`   //桌子id
 TStatus  int `json:"tstatus"`   //桌子状态
 BankerSeatId int `json:"bankerseatid"` //庄家座位id
 UStatus      int `json:"ustatus"`      //玩家自己的状态
 MaxBetMul    int `json:"maxbetmul"`    //玩家最大下注倍数
 BetTime      int `json:"bettime"`      //下注时间
 }
* */


var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifySureBankerPacket() {
    MessageResp.apply(this, []);  //集成父类数据
    //{"cmd":6619144,"seq":0,"uid":10010,"code":0,"desc":"","tableid":2,"tstatus":3,
    // "bankerseatid":1,"bankeruid":10011,"ustatus":5,"maxbetmul":25,"bettime":10}

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.bankeruid = 0;
    this.bankerseatid = -1;
    this.ustatus = 0;
    this.maxbetmul = 0;
    this.bettime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;

        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.bankeruid = msg.bankeruid;
        this.bankerseatid = msg.bankerseatid;
        this.ustatus = msg.ustatus;
        this.maxbetmul = msg.maxbetmul;
        this.bettime = msg.bettime;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  Bullfight_NotifySureBankerPacket;