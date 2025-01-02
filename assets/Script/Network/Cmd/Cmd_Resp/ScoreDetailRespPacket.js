/**
 * Created by shrimp on 17/3/30.
 */
/**
 type US_RESP_SCORE_DETAIL_T struct {
     JsonHead
     RespHead
     Param PARAM_RESP_SCORE_DETAIL_T `json:"param"`
 }

 type PARAM_RESP_SCORE_DETAIL_T struct {
     Table  PARAM_TABLE_DETAIL_T `json:"table"`
     MySelf PARAM_MYSELF_SCORE_T `json:"myself"`
    List   []TABLE_USER_SCORE_T `json:"list"`
 }

 type PARAM_TABLE_DETAIL_T struct {
     TableName string `json:"tablename"` //牌局名称
     GameId    int    `json:"gameid"`    //选择玩法(游戏id)
     MinAnte   int    `json:"minante"`   //最小下注(1)
     GameType  int    `json:"gametype"`  //抢庄模式
     LiveTime  int64  `json:"livetime"`  //桌子时间
     MaxSeat   int    `json:"maxseat"`   //本桌人数
 }

 type PARAM_MYSELF_SCORE_T struct {
     CarryCoin  int `json:"carrycoin"`  //带入金币
     WinCoin    int `json:"wincoin"`    //输赢(最终战绩)
     WinNum     int `json:"winnum"`     //赢牌次数
     LoseNum    int `json:"losenum"`    //失败次数
     PlayNum    int `json:"playnum"`    //玩牌次数
     SuperNum   int `json:"supernum"`   //超级抢庄次数
     NormalNum  int `json:"normalnum"`  //普通抢庄次数
     NotCallNum int `json:"notcallnum"` //未叫庄次数
     BankerNum  int `json:"bankernum"`  //坐庄次数
     ChatNum    int `json:"chatnum"`    //聊天次数
     GiftNum    int `json:"giftnum"`    //发送礼物次数
     UseGold    int `json:"usegold"`    //发送礼物消耗金币
     UseDiamond int `json:"usediamond"` //抢庄消耗钻石
 }

 type TABLE_USER_SCORE_T struct {
     Uid       int    `json:"uid"`
     Name      string `json:"name"`
     HeadUrl   string `json:"headurl"`
     CarryCoin int    `json:"carrycoin"`
     WinCoin   int    `json:"wincoin"`
 }
* */
var MessageResp = require("MessageResp");
function ScoreDetailRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_SCORE_DETAIL_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq    = msg.seq;
        this.uid    = msg.uid;
        this.code   = msg.code;
        this.desc   = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.param  = msg.param;
        this.table  = this.param.table;
        this.myself = this.param.myself;
        this.list   = this.param.list;
    };
}

module.exports =  ScoreDetailRespPacket;