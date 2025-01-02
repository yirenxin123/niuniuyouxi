/**
 * Created by shrimp on 17/4/9.
 */
var MessageResp = require("MessageResp");
/*
* type CLUB_NOTIFY_OWNER_CONFIRM_T struct {
 ClubHead
 Param CLUB_MSG_JOIN_T `json:"param"`
 }
 type CLUB_MSG_JOIN_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 }
* */
function NotifyClubOwnerConfirmPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.clubid = msg.clubid;
        this.param  = msg.param;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  NotifyClubOwnerConfirmPacket;