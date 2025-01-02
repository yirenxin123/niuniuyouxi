"use strict";

/**
 * Created by shrimp on 17/2/19.
 */
//socket 回复消息 成功标志

window.SocketSeq = 0;

window.SocketRetCode = cc.Enum({
    RET_REPEAT_REGISTER: -1000, //服务器重复注册(服务器内部消息)
    RET_NOT_CALL_BANKER: -19, //非抢庄状态
    RET_USER_OFFLINE: -18, //玩家离线
    RET_NOT_CLICK_AGAIN: -17, //请勿频繁点击
    RET_SEAT_HAVE_PLAYER: -16, //您选择的座位已经被占领,请从新选择
    RET_SEAT_NOT_EXIST: -15, //您选择的座位不存在
    RET_PLAYER_ACTIVE: -14, //您正在游戏中,不能离开
    RET_PLAYER_HAVE_LEAVE: -13, //您已经离开
    RET_PARAM_ERROR: -12, //参数错误
    RET_DESTROYED_PRIVATE_TBALE: -11, //牌局已销毁
    RET_TABLE_FULL: -10, //私人房爆满
    RET_GAME_PLAYER_FULL: -9, //桌子里面的玩家已满
    RET_GAME_TABLE_FULL: -8, //游戏服务器桌子爆满
    RET_DB_ERROR: -7, //数据库错误
    RET_NOT_FIND_TABLE: -6, //桌子不存在
    RET_NOT_FIND_GAME_SERVER: -5, //未找到匹配服务器
    RET_SERVER_ABNORMAL: -4, //服务异常
    RET_USER_REPEAT_LOGIN: -3, //您的账号已经在其他地点登录
    RET_USERKEY_ERROR: -2, //用户验证失败,请重新登录
    RET_ILLEGAL_REQ: -1, //非法请求(如:如果头部uid,不是自己的socket链接的uid就直接返回,反漏洞)
    RET_SUCCESS: 0, //成功
    RET_BACK_GAME_TABLE: 1, //您已经在游戏中
    RET_GOLD_LACK: 2, //您金币不足
    RET_DIAMOND_LACK: 3, //您钻石不足
    RET_COIN_LACK: 4, //您携带金币不足
    RET_COIN_GREATER_GOLD: 5, //携带金币大于身上金币
    RET_REJECT_SIT_DOWN: 6 });

window.SocketRetDesc = cc.Enum({
    RET_REJECT_SIT_DOWN: "您的请求被拒绝",
    RET_COIN_GREATER_GOLD: "携带金币大于身上金币",
    RET_COIN_LACK: "您带入的金币不足,请从新选择带入金币",
    RET_DIAMOND_LACK: "您钻石不足",
    RET_GOLD_LACK: "您金币不足",
    RET_BACK_GAME_TABLE: "您已经在游戏中",
    RET_SUCCESS: "执行成功",
    RET_ILLEGAL_REQ: "非法请求",
    RET_USERKEY_ERROR: "用户验证失败,请重新登录",
    RET_USER_REPEAT_LOGIN: "您的账号已经在其他地点登录",
    RET_SERVER_ABNORMAL: "服务异常",
    RET_NOT_FIND_GAME_SERVER: "未找到匹配的游戏服务器",
    RET_NOT_FIND_TABLE: "桌子不存在",
    RET_DB_ERROR: "数据库错误",
    RET_GAME_TABLE_FULL: "游戏服务器爆满,请稍后再试",
    RET_GAME_PLAYER_FULL: "桌子里面的玩家已满",
    RET_TABLE_FULL: "房间已满,请选择其他房间",
    RET_DESTROYED_PRIVATE_TBALE: "牌局已销毁",
    RET_PARAM_ERROR: "参数错误",
    RET_PLAYER_ACTIVE: "您正在游戏中,不能离开",
    RET_PLAYER_HAVE_LEAVE: "您已经离开",
    RET_SEAT_NOT_EXIST: "您选择的座位不存在",
    RET_NOT_CLICK_AGAIN: "请勿频繁点击",
    RET_SEAT_HAVE_PLAYER: "您选择的座位已经被占领,请从新选择",
    RET_NOT_CALL_BANKER: "非抢庄状态",
    RET_USER_OFFLINE: "玩家离线",
    RET_REPEAT_REGISTER: "服务器重复注册"
});

window.PACKET_HEADER_SIZE = 18,

//socket消息
window.SocketMessage = "SocketMessage";

/**
 * 引擎状态消息
 * @type {string}
 */
window.SOCKETT_SENDMESSAGE = "SendMessage";

//socket消息类型
window.MessageType = cc.Enum({
    SOCKET_MESSAGE: "socket_message", //socket 回包
    SOCKET_CONNECTING: "socket_connecting", //socket开始重连
    //SOCKETT_SENDMESSAGE  :   "SendMessage",
    MSG_NETWORK_FAILURE: "socket_network_failure",
    SOCKET_DISCONNECTED: "socket_disconnected",
    SOCKET_CONNECTED: "socket_connected",
    SENDMSG_TIMEOUT: "sendmsg_timeout",
    SENDMSG_CLOSESERVER: "sendmsg_closeserver",
    SCENE_MSG: "Scene_Msg" });

/**
 * 引擎状态消息
 * @type {string}
 */
window.GameEngineInfo = "GameEngineInfo";
window.GameInfo = {

    GameHide: "GameHide", //游戏暂停
    GameShow: "GameShow", //游戏唤醒
    NetOnline: "NetOnline", //网络连接
    NetOffline: "NetOffline" };

window.HEART_BEAT_TIME = 30;