'use strict';

/**
 * Created by shrimp on 17/3/1.
 */
var Cmd_Common = require('Cmd_Common');

module.exports = {

    SBF_REQ_READY_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x1, //准备
    SBF_RESP_READY_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x2,
    SBF_NOTIFY_GAME_START_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x4, //通知玩家,游戏开始,发三张牌

    SBF_REQ_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x5, //抢庄 (不抢，普通，超级)
    SBF_RESP_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x6, //返回

    SBF_NOTIFY_CONFIRM_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x8, //通知玩家,确定庄家

    SBF_REQ_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x9, //下注（不点下注，默认最小）
    SBF_RESP_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xa,

    SBF_NOTIFY_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xc, //通知看牌

    SBF_REQ_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xd, //开牌
    SBF_RESP_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xe, //

    SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x10, //通知一局结束结果

    SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x16, //通知未选择抢庄的玩家为不抢
    SBF_NOTIFY_NOT_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x18, //未下注的玩家

    SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x12, //通知总结果

    //请求桌子详情
    US_REQ_TABLE_DETAIL_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x15,
    US_RESP_TABLE_DETAIL_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x16,
    //帮助,提示是否有牛
    SBF_REQ_HELP_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x5,
    SBF_RESP_HELP_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x6,

    US_REQ_PLAYER_LIST_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x17, //获取玩家列表
    US_RESP_PLAYER_LIST_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x18, //获取玩家列表


    //托管
    SBF_REQ_AI_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x7,
    SBF_RESP_AI_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x8,
    //通知踢人（群主主动踢，身上没钱踢）
    SBF_NOTIFY_KICKOUT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x14 //通知踢人

};