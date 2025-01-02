/**
 * Created by shrimp on 17/4/15.
 */
var MessageResp = require('MessageResp');

function ClubOwnerModifyRoleRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID;


    // type CLUB_RESP_OWNER_MODIFY_ROLE_T struct {
    //     JsonHead
    //     RespHead
    //     Param PARAM_RESP_OWNER_MODIFY_ROLE_T `json:"param"`
    // }
    //
    // type PARAM_RESP_OWNER_MODIFY_ROLE_T struct {
    //     ClubId int    `json:"clubid"`
    //     Uid    uint32 `json:"uid"`
    //     Role   uint8  `json:"role"`
    // }

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.param = msg.param;
    };
}

module.exports =  ClubOwnerModifyRoleRespPacket;