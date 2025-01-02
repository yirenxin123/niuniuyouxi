/**
 * Created by shrimp on 17/2/19.
 */

var HeartReqPacket = require('HeartReqPacket');
var HeartRespPacket = require('HeartRespPacket');
var LoginReqPacket = require('LoginReqPacket');
var LoginRespPacket = require('LoginRespPacket');
var CreateRoomReqPacket = require('CreateRoomReqPacket');
var CreateRoomRespPacket = require('CreateRoomRespPacket');
var FindRoomReqPacket = require('FindRoomReqPacket');
var FindRoomRespPacket = require('FindRoomRespPacket');
var EnterRoomReqPacket = require('EnterRoomReqPacket');
var EnterRoomRespPacket = require('EnterRoomRespPacket');
var LeaveGameReqPacket = require('LeaveGameReqPacket');
var LeaveGameRespPacket = require('LeaveGameRespPacket');
var ServerKickOutPacket = require('ServerKickOutPacket');
//var NotifyTableOwnerSitPacket = require('NotifyTableOwnerSitPacket');
var OwnerConfirmReqPacket = require('OwnerConfirmReqPacket');
var OwnerConfirmRespPacket = require('OwnerConfirmRespPacket');
var OwnerKickOutPlayerReqPacket = require('OwnerKickOutPlayerReqPacket');
var OwnerKickOutPlayerRespPacket = require('OwnerKickOutPlayerRespPacket');
var StartGameReqPacket = require('StartGameReqPacket');
var StartGameRespPacket = require('StartGameRespPacket');
var DismissGameReqPacket = require('DismissGameReqPacket');
//var DismissGameRespPacket = require('DismissGameRespPacket');
var NotifyDismissGame = require('NotifyDismissGame');
var SitDownReqPacket = require('SitDownReqPacket');
var SitDownRespPacket = require('SitDownRespPacket');
var NotifyOwnerOverPacket = require('NotifyOwnerOverPacket');
var ChatReqPacket = require('ChatReqPacket');
var ChatRespPacket = require('ChatRespPacket');
var NotifyOwnerSitPacket = require("NotifyOwnerSitPacket");
var CarryCoinReqPacket = require('CarryCoinReqPacket');
var CarryCoinRespPacket = require('CarryCoinRespPacket');
var NotifyGameStartPacket = require('NotifyGameStartPacket');
var FindRespPacket = require('FindRespPacket');
var FindReqPacket = require('FindReqPacket');
var ScoreListReqPacket = require('ScoreListReqPacket');
var ScoreListRespPacket = require('ScoreListRespPacket');
var ScoreDetailReqPacket = require('ScoreDetailReqPacket');
var ScoreDetailRespPacket = require('ScoreDetailRespPacket');
var ShopConfReqPacket = require('ShopConfReqPacket');
var ShopConfRespPacket = require('ShopConfRespPacket');
var CreateClubReqPacket = require('CreateClubReqPacket');
var CreateClubRespPacket = require('CreateClubRespPacket');
var GetClubListReqPacket = require('GetClubListReqPacket');
var GetClubListRespPacket = require('GetClubListRespPacket');
var GetClubTableReqPacket = require('GetClubTableReqPacket');
var GetClubTableRespPacket = require('GetClubTableRespPacket');
var SearchClubReqPacket = require('SearchClubReqPacket');
var SearchClubRespPacket = require('SearchClubRespPacket');
var ModifyClubInfoReqPacket = require('ModifyClubInfoReqPacket');
var ModifyClubInfoRespPacket = require('ModifyClubInfoRespPacket');
var GetMemberListReqPacket = require('GetMemberListReqPacket');
var GetMemberListRespPacket = require('GetMemberListRespPacket');
var JoinClubReqPacket = require('JoinClubReqPacket');
var JoinClubRespPacket = require('JoinClubRespPacket');
var NotifyClubOwnerConfirmPacket = require('NotifyClubOwnerConfirmPacket');
var ClubOwnerConfirmReqPacket = require('ClubOwnerConfirmReqPacket');
var ClubOwnerConfirmRespPacket = require('ClubOwnerConfirmRespPacket');
var ClubDelMemberReqPacket = require('ClubDelMemberReqPacket');
var ClubDelMemberRespPacket = require('ClubDelMemberRespPacket');
var GetMsgNumReqPacket = require('GetMsgNumReqPacket');
var GetMsgNumRespPacket = require('GetMsgNumRespPacket');
var GetMsgListReqPacket = require('GetMsgListReqPacket');
var GetMsgListRespPacket = require('GetMsgListRespPacket');
var MsgReadReqPacket = require('MsgReadReqPacket');
var MsgReadRespPacket = require('MsgReadRespPacket');
var DismissClubReqPacket = require('DismissClubReqPacket');
var DismissClubRespPacket = require('DismissClubRespPacket');
var ClubOwnerModifyRoleRespPacket = require('ClubOwnerModifyRoleRespPacket');
var ClubOwnerModifyRoleReqPacket = require('ClubOwnerModifyRoleReqPacket');
var ClubCreateRoomReqPacket   = require('ClubCreateRoomReqPacket');
var ClubCreateRoomRespPacket  = require('ClubCreateRoomRespPacket');
var UserDetailReqPacket       = require('UserDetailReqPacket');
var UserDetailRespPacket      = require('UserDetailRespPacket');
var CreateTableCostReqPacket  = require('CreateTableCostReqPacket');
var CreateTableCostRespPacket = require('CreateTableCostRespPacket');
var ClubUpgradeCostReqPacket  = require('ClubUpgradeCostReqPacket');
var ClubUpgradeCostRespPacket = require('ClubUpgradeCostRespPacket');
var ExchangeGoldReqPacket  = require('ExchangeGoldReqPacket');
var ExchangeGoldRespPacket = require('ExchangeGoldRespPacket');
var BannerListReqPacket    = require('BannerListReqPacket');
var BannerListRespPacket   = require('BannerListRespPacket');
var NotifyPayOperatePacket = require('NotifyPayOperatePacket');
var NotifyInGameRespPacket = require('NotifyInGameRespPacket');
var BindReferralReqPacket  = require('BindReferralReqPacket');
var BindReferralRespPacket = require('BindReferralRespPacket');
/*
var DismissTableReqPacket = require('DismissTableReqPacket');
var ConfirmDismissTableReqPacket = require('ConfirmDismissTableReqPacket');
var DismissTableRspPacket = require('DismissTableRspPacket');
var ConfirmDismissTableRspPacket = require('ConfirmDismissTableRspPacket');
var DismissTableNotifyPacket  = require('DismissTableNotifyPacket');
var ConfirmDismissTableNotifyPacket = require('ConfirmDismissTableNotifyPacket');
*/
var MessageFactory_Common = {

    //Clint 请求
    createMessageReq : function(cmd){
        var msg = null ;
        switch(cmd) {
            case window.US_REQ_HEARTBEAT_CMD_ID:
                msg = new HeartReqPacket;
                break;
            case window.US_REQ_LOGIN_CMD_ID:
                msg = new LoginReqPacket;
                break;
            case window.US_REQ_CREATE_TABLE_CMD_ID:
                msg = new CreateRoomReqPacket;
                break;
            case window.US_REQ_ENTER_GAME_CMD_ID:
                msg = new EnterRoomReqPacket;
                break;
            case window.US_REQ_FIND_TABLE_CMD_ID:
                msg = new FindRoomReqPacket;
                break;
            case window.US_REQ_LEAVE_GAME_CMD_ID:
                msg = new LeaveGameReqPacket;
                break;
            case window.US_REQ_OWNER_CONFIRM_CMD_ID:
                msg = new OwnerConfirmReqPacket;
                break;
            case window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID:
                msg = new OwnerKickOutPlayerReqPacket;
                break;
            case window.US_REQ_GAME_SWITCH_CMD_ID:
                msg = new StartGameReqPacket;
                break;
            case window.US_REQ_SIT_DOWN_CMD_ID:
                msg = new SitDownReqPacket;
                break;
            case window.US_REQ_GAME_CHAT_CMD_ID:
                msg = new ChatReqPacket;
                break;
            case window.US_REQ_CARRY_COIN_CMD_ID:
                msg = new CarryCoinReqPacket;
                break;
            case window.US_REQ_FOUND_TABLE_CMD_ID:
                msg = new FindReqPacket;
                break;
            case window.US_REQ_SCORE_LIST_CMD_ID:
                msg = new ScoreListReqPacket;
                break;
            case window.US_REQ_SCORE_DETAIL_CMD_ID:
                msg = new ScoreDetailReqPacket;
                break;
            case window.US_REQ_SHOP_CONF_CMD_ID:
                msg = new ShopConfReqPacket;
                break;
            case window.US_REQ_CREATE_CLUB_CMD_ID:
                msg = new CreateClubReqPacket;
                break;
            case window.US_REQ_CLUB_LIST_CMD_ID:
                msg = new GetClubListReqPacket;
                break;
            case window.US_REQ_CLUB_TABLE_CMD_ID:
                msg = new GetClubTableReqPacket;
                break;
            case window.US_REQ_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubReqPacket;
                break;
            case window.CLUB_REQ_MODIFY_INFO_CMD_ID:
                msg = new ModifyClubInfoReqPacket;
                break;
            case window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID:
                msg = new GetMemberListReqPacket;
                break;
            case window.CLUB_REQ_JOIN_CLUB_CMD_ID:
                msg = new JoinClubReqPacket;
                break;
            case window.CLUB_REQ_OWNER_CONFIRM_CMD_ID:
                msg = new ClubOwnerConfirmReqPacket;
                break;
            case window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID:
                msg = new ClubDelMemberReqPacket;
                break;
            case window.US_REQ_NEW_MSG_NUM_CMD_ID:
                msg = new GetMsgNumReqPacket;
                break;
            case window.US_REQ_MSG_LIST_CMD_ID:
                msg = new GetMsgListReqPacket;
                break;
            case window.US_REQ_SET_MSG_READ_CMD_ID:
                msg = new MsgReadReqPacket;
                break;
            case window.CLUB_REQ_DISMISS_CLUB_CMD_ID:
                msg = new DismissClubReqPacket;
                break;
            case window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID:
                msg = new ClubOwnerModifyRoleReqPacket;
                break;
            case window.CLUB_REQ_CREATE_TABLE_CMD_ID:
                msg = new ClubCreateRoomReqPacket;
                break;
            case window.US_REQ_USER_DETAIL_CMD_ID:
                msg = new UserDetailReqPacket;
                break;

            case window.US_REQ_CREATE_COST_CMD_ID:
                msg = new CreateTableCostReqPacket;
                break;

            case window.US_REQ_CLUB_UPGRADE_COST_CMD_ID:
                msg = new ClubUpgradeCostReqPacket;
                break;

            case window.US_REQ_EXCHANGE_GOLD_CMD_ID:
                msg = new ExchangeGoldReqPacket;
                break;
                
            case window.US_REQ_BANNER_LIST_CMD_ID:
                msg = new BannerListReqPacket;
                break;

            case window.US_REQ_BIND_REFERRAL_CMD_ID:
                msg = new BindReferralReqPacket;
                break;

            /*
            case window.US_REQ_DISMISS_TABLE_CMD_ID:
                msg = new DismissTableReqPacket;
                break;

            case window.US_REQ_CONFIRM_DISMISS_TABLE_CMD_ID:
                msg = new ConfirmDismissTableReqPacket;
                break;
             */

        }
        return msg;
    },

    // Server 回应
    createMessageResp : function(cmd){
        var msg = null ;
        switch(cmd) {
            case window.US_RESP_HEARTBEAT_CMD_ID:
                msg = new HeartRespPacket;
                break;

            case window.US_RESP_LOGIN_CMD_ID:
                msg = new LoginRespPacket;
                break;

            case window.US_RESP_CREATE_TABLE_CMD_ID:
                msg = new CreateRoomRespPacket;
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                msg = new EnterRoomRespPacket;
                break;
            case window.US_RESP_FIND_TABLE_CMD_ID:
                msg = new FindRoomRespPacket;
                break;

            case window.US_RESP_LEAVE_GAME_CMD_ID:
                msg = new LeaveGameRespPacket;
                break;

            case window.US_KICK_OUT_CMD_ID:
                msg = new ServerKickOutPacket;
                break;

            case window.US_RESP_OWNER_CONFIRM_CMD_ID:
                msg = new OwnerConfirmRespPacket;
                break;

            case window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID:
                msg = new OwnerKickOutPlayerRespPacket;
                break;

            case window.US_RESP_GAME_SWITCH_CMD_ID:
                msg = new StartGameRespPacket;
                break;

            case window.US_NOTIFY_DISMISS_GAME_CMD_ID:
                msg = new NotifyDismissGame;
                break;

            case window.US_RESP_SIT_DOWN_CMD_ID:
                msg = new SitDownRespPacket;
                break;

            case window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID:
                msg = new NotifyOwnerOverPacket;
                break;

            case window.US_RESP_GAME_CHAT_CMD_ID:
                msg = new ChatRespPacket;
                break;

            case window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID:
                msg = new NotifyOwnerSitPacket;
                break;

            case window.US_RESP_CARRY_COIN_CMD_ID:
                msg = new CarryCoinRespPacket;
                break;

            case window.US_NOTIFY_GAME_SWITCH_CMD_ID:
                msg = new NotifyGameStartPacket;
                break;

            case window.US_RESP_FOUND_TABLE_CMD_ID:
                msg = new FindRespPacket;
                break;

            case window.US_RESP_SCORE_LIST_CMD_ID:
                msg = new ScoreListRespPacket;
                break;

            case window.US_RESP_SCORE_DETAIL_CMD_ID:
                msg = new ScoreDetailRespPacket;
                break;

            case window.US_RESP_SHOP_CONF_CMD_ID:
                msg = new ShopConfRespPacket;
                break;

            case window.US_RESP_CREATE_CLUB_CMD_ID:
                msg = new CreateClubRespPacket;
                break;

            case window.US_RESP_CLUB_LIST_CMD_ID:
                msg = new GetClubListRespPacket;
                break;

            case window.US_RESP_CLUB_TABLE_CMD_ID:
                msg = new GetClubTableRespPacket;
                break;

            case window.US_RESP_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubRespPacket;
                break;

            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                msg = new ModifyClubInfoRespPacket;
                break;

            case window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                msg = new GetMemberListRespPacket;
                break;

            case window.CLUB_RESP_JOIN_CLUB_CMD_ID:
                msg = new JoinClubRespPacket;
                break;

            case window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID:
                msg = new NotifyClubOwnerConfirmPacket;
                break;

            case window.CLUB_RESP_OWNER_CONFIRM_CMD_ID:
                msg = new ClubOwnerConfirmRespPacket;
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                msg = new ClubDelMemberRespPacket;
                break;

            case window.US_RESP_NEW_MSG_NUM_CMD_ID:
                msg = new GetMsgNumRespPacket;
                break;

            case window.US_RESP_MSG_LIST_CMD_ID:
                msg = new GetMsgListRespPacket;
                break;

            case window.US_RESP_SET_MSG_READ_CMD_ID:
                msg = new MsgReadRespPacket;
                break;

            case window.US_RESP_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubRespPacket;
                break;

            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                msg = new DismissClubRespPacket;
                break;

            case window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID:
                msg = new ClubOwnerModifyRoleRespPacket;
                break;

            case window.CLUB_RESP_CREATE_TABLE_CMD_ID:
                msg = new ClubCreateRoomRespPacket;
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                msg = new UserDetailRespPacket;
                break;

            case window.US_RESP_CREATE_COST_CMD_ID:
                msg = new CreateTableCostRespPacket;
                break;

            case window.US_RESP_CLUB_UPGRADE_COST_CMD_ID:
                msg = new ClubUpgradeCostRespPacket;
                break;

            case window.US_RESP_EXCHANGE_GOLD_CMD_ID:
                msg = new ExchangeGoldRespPacket;
                break;

            case window.US_RESP_BANNER_LIST_CMD_ID:
                msg = new BannerListRespPacket;
                break;
            case window.US_NOTIFY_PAY_OPERATE_CMD_ID:
                msg = new NotifyPayOperatePacket;
                break;


            case window.US_NOTIFY_IN_GAME_CMD_ID:
                msg = new NotifyInGameRespPacket;
                break;

            case window.US_RESP_BIND_REFERRAL_CMD_ID:
                msg = new BindReferralRespPacket;
                break;
/*
            case window.US_RSP_DISMISS_TABLE_CMD_ID:
                msg = new DismissTableRspPacket;
                break;

            case window.US_RSP_CONFIRM_DISMISS_TABLE_CMD_ID:
                msg = new ConfirmDismissTableRspPacket;
                break;

            case window.US_NOTIFY_DISMISS_TABLE_CMD_ID:
                msg = new DismissTableNotifyPacket;
                break;

            case window.US_NOTIFY_CONFIRM_DISMISS_TABLE_CMD_ID:
                msg = new ConfirmDismissTableNotifyPacket;
                break;
 */


        }

        return msg;
    }
};

module.exports = MessageFactory_Common;