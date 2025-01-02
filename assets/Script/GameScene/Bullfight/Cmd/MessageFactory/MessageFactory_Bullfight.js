/**
 * Created by shrimp on 17/3/2.
 */
var Cmd_Bullfight = require('Cmd_Bullfight');
var Bullfight_BetCoinRespPacket = require('Bullfight_BetCoinRespPacket');
var Bullfight_CallBankerRespPacket = require('Bullfight_CallBankerRespPacket');
var Bullfight_HelpRespPacket = require('Bullfight_HelpRespPacket');
var Bullfight_OpenCardRespPacket = require('Bullfight_OpenCardRespPacket');
var Bullfight_TableDetailRespPacket = require('Bullfight_TableDetailRespPacket');
var Bullfight_BetCoinReqPacket = require('Bullfight_BetCoinReqPacket');
var Bullfight_CallBankerReqPacket = require('Bullfight_CallBankerReqPacket');
var Bullfight_HelpReqPacket = require('Bullfight_HelpReqPacket');
var Bullfight_OpenCardReqPacket = require('Bullfight_OpenCardReqPacket');
var Bullfight_TableDetailReqPacket = require('Bullfight_TableDetailReqPacket');
var Bullfight_NotifyGameOverOncePacket = require('Bullfight_NotifyGameOverOncePacket');
var Bullfight_NotifyGameOverTotalPacket = require('Bullfight_NotifyGameOverTotalPacket');
var Bullfight_ReadyReqPacket = require('Bullfight_ReadyReqPacket');
var Bullfight_ReadyRespPacket = require('Bullfight_ReadyRespPacket');
var Bullfight_NotifyGameStartPacket = require('Bullfight_NotifyGameStartPacket');
var Bullfight_NotifySureBankerPacket = require('Bullfight_NotifySureBankerPacket');
var Bullfight_NotifyOpenCardPacket = require('Bullfight_NotifyOpenCardPacket');
var Bullfight_NotifyKickOutPacket = require('Bullfight_NotifyKickOutPacket');
var Bullfight_NotifyNotCallBankerPacket = require('Bullfight_NotifyNotCallBankerPacket');
var Bullfight_NotifyNotBetPacket = require('Bullfight_NotifyNotBetPacket');
var Bullfight_GetPlayersListReqPacket = require('Bullfight_GetPlayersListReqPacket');
var Bullfight_GetPlayersListRespPacket = require('Bullfight_GetPlayersListRespPacket');

var MessageFactory_Bullfight = {

    //Clint 请求
    createMessageReq : function(cmd){
        var msg = null ;
        switch(cmd) {
            case Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID:
                msg = new Bullfight_BetCoinReqPacket;
                break;
            case Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID:
                msg = new Bullfight_CallBankerReqPacket;
                break;
            case Cmd_Bullfight.SBF_REQ_HELP_CMD_ID:
                msg = new Bullfight_HelpReqPacket;
                break;
            case Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID:
                msg = new Bullfight_OpenCardReqPacket;
                break;
            case Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID:
                msg = new Bullfight_TableDetailReqPacket;
                break;
            case Cmd_Bullfight.SBF_REQ_READY_CMD_ID:
                msg = new Bullfight_ReadyReqPacket;
                break;
            case Cmd_Bullfight.US_REQ_PLAYER_LIST_CMD_ID:
                msg = new Bullfight_GetPlayersListReqPacket;
                break;
        }
        return msg;
    },

    // Server 回应
    createMessageResp : function(cmd){
        var msg = null ;
        switch(cmd) {
            case Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID:
                msg = new Bullfight_BetCoinRespPacket;
                break;
            case Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID:
                msg = new Bullfight_CallBankerRespPacket;
                break;
            case Cmd_Bullfight.SBF_RESP_HELP_CMD_ID:
                msg = new Bullfight_HelpRespPacket;
                break;
            case Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID:
                msg = new Bullfight_OpenCardRespPacket;
                break;
            case Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID:
                msg = new Bullfight_TableDetailRespPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID:
                msg = new Bullfight_NotifyGameOverOncePacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID:
                msg = new Bullfight_NotifyGameOverTotalPacket;
                break;
            case Cmd_Bullfight.SBF_RESP_READY_CMD_ID:
                msg = new Bullfight_ReadyRespPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID:
                msg = new Bullfight_NotifyGameStartPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID:
                msg = new Bullfight_NotifySureBankerPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID:
                msg = new Bullfight_NotifyOpenCardPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID:
                msg = new Bullfight_NotifyKickOutPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID:
                msg = new Bullfight_NotifyNotCallBankerPacket;
                break;
            case Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID:
                msg = new Bullfight_NotifyNotBetPacket;
                break;
            case Cmd_Bullfight.US_RESP_PLAYER_LIST_CMD_ID:
                msg = new Bullfight_GetPlayersListRespPacket;
                break;
        }
        return msg;
    }
};


module.exports = MessageFactory_Bullfight;