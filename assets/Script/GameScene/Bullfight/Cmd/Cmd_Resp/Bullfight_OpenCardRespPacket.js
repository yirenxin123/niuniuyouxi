/**
 * Created by shrimp on 17/3/2.
 */

/*
*
* type SBF_RESP_OPEN_CARD_T struct {
 JsonHead
 RespHead
 OpenUid  int      `json:"openuid"`
 BullType int      `json:"bulltype"`
 Cards    []uint16 `json:"cards"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_OpenCardRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID;
    //{"cmd":6619150,"seq":10,"uid":10010,"code":0,"desc":"",
    // "openuid":10010,"bulltype":0,"cards":[12,36,19,50,33]}
    this.openuid  = 0;
    this.bulltype = 0;
    this.seatid   = -1;
    this.cards    = [];
    this.index1   = -1;
    this.index2   = -1;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.openuid  = msg.openuid;
        this.bulltype = msg.bulltype;
        this.cards    = msg.cards;
        this.seatid   = msg.seatid;
        this.tstatus  = msg.tstatus;
        this.index1   = msg.index1;
        this.index2   = msg.index2;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  Bullfight_OpenCardRespPacket;