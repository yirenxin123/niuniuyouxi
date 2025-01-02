/**
 * Created by shrimp on 17/3/30.
 */
/*
* type US_RESP_FOUND_TABLE_T struct {
 JsonHead
 RespHead
 List []PRIVATE_TABLE_DETAIL_T `json:"list"`
 }
 type PRIVATE_TABLE_DETAIL_T struct {
 OwnerName  string `json:"ownername"`
 TableName  string `json:"tablename"`
 HeadUrl    string `json:"headurl"`
 MinAnte    int    `json:"minante"`
 RemainTime int    `json:"remaintime"`
 GameType   int    `json:"gametype"`
 GameId     int    `json:"gameid"`
 GameSvcId  int    `json:"gamesvcid"`
 TableId    int    `json:"tableid"`
 }

 * */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');

function FindRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_FOUND_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.list = msg.list;
    };
}

module.exports =  FindRespPacket;