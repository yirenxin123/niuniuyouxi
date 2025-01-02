/**
 * Created by shrimp on 17/4/8.
 */
var MessageResp = require("MessageResp");
/*
* type US_RESP_CLUB_TABLE_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_CLUB_TABLE_T `json:"param"`
 }
 type PARAM_RESP_CLUB_TABLE_T struct {
 ClubId int `json:"clubid"`
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
function GetClubTableRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_CLUB_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;

        this.param  = msg.param;
        this.clubid = this.param.clubid;
        this.list   = this.param.list;
    };
}

module.exports =  GetClubTableRespPacket;