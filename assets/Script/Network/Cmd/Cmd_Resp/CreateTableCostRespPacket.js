/*

 type US_RESP_CREATE_COST_T struct {
     JsonHead
     RespHead
     List []PRIVATE_TABLE_COST_T `json:"list"`
 }

 type PRIVATE_TABLE_COST_T struct {
     Type    int `json:"type"`    //1: live time 2: min ante
     Value   int `json:"value"`   //second or ante
     Diamond int `json:"diamond"` //消耗钻石
     Gold    int `json:"gold"`    //消耗金币
 }

*/

var MessageResp = require("MessageResp");

function CreateTableCostRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd  = window.US_RESP_CREATE_COST_CMD_ID;
    this.list = [];

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CreateTableCostRespPacket.onMessage");
        this.seq  = msg.seq;
        this.uid  = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;

        this.list = msg.list;
    };
}

module.exports =  CreateTableCostRespPacket;
