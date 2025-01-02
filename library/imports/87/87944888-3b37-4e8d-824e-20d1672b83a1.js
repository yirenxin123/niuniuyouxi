"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

window.ServerType = cc.Enum({
    //E_USER_SERVER_TYPE          : 1,
    //E_CENTER_SERVER_TYPE        : 3,
    //E_COMMON_GAME_TYPE          :100,
    //E_SIX_BULLFIGHT_TYPE        : 101,       //六人模式
    //E_BULLFIGHT_HUNDRED_TYPE    : 102,       //百人
    E_UNKNOWN_SERVER_TYPE: 0,
    E_USER_SERVER_TYPE: 1, //接入服务器
    E_DB_SERVER_TYPE: 2, //数据服务器
    E_CENTER_SERVER_TYPE: 3, //中心服务器,要保存数据一致性,如私人房ID,
    E_STATUS_SERVER_TYPE: 4, //状态服务器
    E_CLUB_SERVER_TYPE: 5, //俱乐部服务器

    E_COMMON_GAME_TYPE: 100, //游戏服类型
    E_SIX_BULLFIGHT_TYPE: 101, //六人模式
    E_BULLFIGHT_HUNDRED_TYPE: 102 });

//心跳
window.US_REQ_HEARTBEAT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x1; //*
window.US_RESP_HEARTBEAT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x2; //*
//用户登录认证
window.US_REQ_LOGIN_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x3; //*
window.US_RESP_LOGIN_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x4; //*
//服务器主动踢人
window.US_KICK_OUT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x6;
//通知玩家之前在某个游戏中
window.US_NOTIFY_IN_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x8;

//通知桌主结束提示
window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x2;
//通知桌主确认玩家是否入座
window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x4;
//创建私人桌
window.US_REQ_CREATE_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x7; //*
window.US_RESP_CREATE_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x8; //返回结果//*
//查找私人房
window.US_REQ_FIND_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x9;
window.US_RESP_FIND_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xa;

//进入游戏
window.US_REQ_ENTER_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x1;
window.US_RESP_ENTER_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x2;
//离开游戏
window.US_REQ_LEAVE_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x3;
window.US_RESP_LEAVE_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x4;

//请求坐下or站起
window.US_REQ_SIT_DOWN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x5;
window.US_RESP_SIT_DOWN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x6;

window.US_REQ_CARRY_COIN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x7; //带入金币
window.US_RESP_CARRY_COIN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x8; //

//桌主确认
window.US_REQ_OWNER_CONFIRM_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x9;
window.US_RESP_OWNER_CONFIRM_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xa;

//群主主动踢人
window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xb;
window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xc;

window.US_NOTIFY_OWNER_KICKOUT_PLAYER_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xe;

//开始牌局/解散
window.US_REQ_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xf;
window.US_RESP_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x10;

window.US_NOTIFY_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x12;

//聊天
window.US_REQ_GAME_CHAT_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x13;
window.US_RESP_GAME_CHAT_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x14;

window.US_REQ_FOUND_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x85; //发现
window.US_RESP_FOUND_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x86;

window.US_REQ_SCORE_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8b; //请求战绩列表
// 返回战绩列表
window.US_RESP_SCORE_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8c; //

window.US_REQ_SCORE_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8d; //获取战绩详情
window.US_RESP_SCORE_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8e; //

window.US_REQ_SHOP_CONF_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x89; //获取商场配置
window.US_RESP_SHOP_CONF_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8a;

window.US_REQ_CREATE_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x81; //创建俱乐部
window.US_RESP_CREATE_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x82; //

window.US_REQ_CLUB_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x83; //获取俱乐部列表
window.US_RESP_CLUB_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x84; //

window.US_REQ_CLUB_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x87; //获取俱乐部桌子列表
window.US_RESP_CLUB_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x88;

window.US_REQ_SEARCH_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x99; //搜索俱乐部
window.US_RESP_SEARCH_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9A;

window.US_REQ_CLUB_UPGRADE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9F; //获取俱乐部升级开销
window.US_RESP_CLUB_UPGRADE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0xA0;

window.CLUB_REQ_MODIFY_INFO_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x1; //修改俱乐部
window.CLUB_RESP_MODIFY_INFO_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x2;

window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x3; //请求俱乐部成员列表
window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x4;

window.CLUB_REQ_JOIN_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x5; //请求加入俱乐部
window.CLUB_RESP_JOIN_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x6;

window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x7; //通知群主确认是否允许加入

window.CLUB_REQ_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x9; //群主确认
window.CLUB_RESP_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xa;

window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xb; //删除成员
window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xc; //

window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xd; //修改玩家权限
window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xe; //

window.US_REQ_NEW_MSG_NUM_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x91; //获取新消息数量
window.US_RESP_NEW_MSG_NUM_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x92;

window.US_REQ_MSG_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x93; //获取消息列表
window.US_RESP_MSG_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x94; //不同的消息类型返回的结果不一样

window.US_REQ_SET_MSG_READ_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x95; //设置消息已读
window.US_RESP_SET_MSG_READ_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x96;

window.US_REQ_USER_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9B; //获取用户详情
window.US_RESP_USER_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9C; //

window.US_REQ_CREATE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9D; //获取创建桌子开销
window.US_RESP_CREATE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9E; //

window.CLUB_REQ_DISMISS_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xf; //解散俱乐部
window.CLUB_RESP_DISMISS_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x10;

window.CLUB_REQ_CREATE_TABLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x11; //创建私人桌
window.CLUB_RESP_CREATE_TABLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x12; //如果创建成功，回广播给所有在线的俱乐部玩家

window.US_NOTIFY_PAY_OPERATE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xc; //通知玩家支付结果

//金币兑换
window.US_REQ_EXCHANGE_GOLD_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8f; //金币兑换协议(给客户端使用)
window.US_RESP_EXCHANGE_GOLD_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x90;

// 解散牌局
// window.US_REQ_DISMISS_GAME_CMD_ID      = ServerType.E_COMMON_GAME_TYPE<<16 | 0x15;
// window.US_RESP_DISMISS_GAME_CMD_ID     = ServerType.E_COMMON_GAME_TYPE<<16 | 0x16;

//解散
window.US_REQ_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x21; //请求解散牌桌
window.US_RSP_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x22; //
window.US_NOTIFY_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x23; //通知

window.US_REQ_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x24; //处理解散请求
window.US_RSP_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x25; //
window.US_NOTIFY_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x26; //通知

// 通知解散牌局
window.US_NOTIFY_DISMISS_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x12;

window.US_REQ_OWNER_CONFIRM_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x15; //是否开启入座
window.US_RESP_OWNER_CONFIRM_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x16;

// //通知桌主
// window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID   = ServerType.E_USER_SERVER_TYPE<<16 | 0xe;
//通知解散牌局
window.US_NOTIFY_DISMISS_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x17;

// 请求广告
window.US_REQ_BANNER_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x97;
// 广告返回列表
window.US_RESP_BANNER_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x98;

// 绑定推广人
window.US_REQ_BIND_REFERRAL_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xD; //绑定推荐入

window.US_RESP_BIND_REFERRAL_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xE;