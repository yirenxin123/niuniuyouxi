'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
/*
*
   type CLUB_RESP_OWNER_RM_MEMBER_T struct {
        JsonHead
        RespHead
        Param PARAM_RESP_OWNER_RM_MEMBER_T `json:"param"`
    }

    type PARAM_RESP_OWNER_RM_MEMBER_T struct {
        ClubId   int    `json:"clubid"`
        ClubName string `json:"clubname"`
        Uid      uint32 `json:"uid"`
        Name     string `json:"name"`
    }
 */
var MessageResp = require('MessageResp');
function ClubDelMemberRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.param = msg.param;
    };
}

module.exports = ClubDelMemberRespPacket;