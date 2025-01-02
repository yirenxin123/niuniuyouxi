/**
 * Created by shrimp on 17/2/23.
 */

var MessageResp = require("MessageResp");
/*
*
* type US_RESP_CREATE_TABLE_T struct {
 JsonHead
 RespHead
 ClubId     int    `json:"clubid"`           //如果是普通玩家，=0
 ClubLevel  int    `json:"clublevel"`  //俱乐部等级
 PrivateIds []int  `json:"privateids"` //如果ret_success, privateIds[0]是新生成的6位数值，
 //如果RET_FULL_PRIVATE_TABLE = -48 代表您创建的私人桌已经达到上线,
 //	privateids是所以创建过的6位数, 界面提示玩家已经创建了哪些私人桌
 GameId     uint16 `json:"gameid"`
 GameLevel  uint16 `json:"gamelevel"`
 GameSvcId  uint32 `json:"gamesvcid"` //游戏服务器ID
 TableId    int32  `json:"tableid"`   //游戏中某张桌子ID
 }*/
function ClubCreateRoomRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_RESP_CREATE_TABLE_CMD_ID;
    this.privateid = 0;         //六位数的桌子ID(房间)
    this.gamesvcid = 0;         //游戏服务器ID
    this.tableid = 0;           //游戏中某张桌子ID
    this.gamelevel = 1;
    this.gameid = 0;
    //接收的数据
    this.onMessage = function (msg) {
        //{"cmd":196616,"seq":1,"uid":10042,"code":0,"desc":"执行成功","privateid":354967,"gamesvcid":5,"tableid":0}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.gameid = msg.gameid;
        this.clubid = msg.clubid;
        this.clublevel = msg.clublevel;
        this.privateid = msg.privateids;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.gamelevel = msg.gamelevel;
        this.gameid = msg.gameid;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  ClubCreateRoomRespPacket;
