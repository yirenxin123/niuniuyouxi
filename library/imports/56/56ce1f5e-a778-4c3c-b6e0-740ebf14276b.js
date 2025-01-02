"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

//http消息返回code
window.HttpCode = cc.Enum({
    HTTP_SUCCESS: 0,
    HTTP_JSON_ERROR: 1, //参数错误
    HTTP_MYSQL_ERROR: 2 });

/**
 * http消息
 */
window.HttpMessage = "HttpMessage";

//http消息类型
window.HttpMessageType = cc.Enum({
    HTTP_NOTIFICATION: "http_notification",
    NOTIFY_HTTP_RSP: "notify_http_rsp",
    NOTIFY_HTTP_RSP_ERROR: "notify_http_rsp_error",
    NOTIFY_HTTP_RSP_IMG: "notify_http_rsp_img",
    IMAGE_LOADER: "image_loader"
});

/**
 * http请求
 */
window.HttpTag = {
    HTTP_TAG_GET_ROUTER: "GetRouter",
    HTTP_TAG_LOGIN: "login",
    HTTP_TAG_GAMECONFIG: "gameconfig"
};

/**
 * 本地消息 主命令
 */
window.LocalMessage = "LocalMessage";

/**
 * 本地消息类型
 */
window.LocalMsgType = {
    GetRoomConfig: "getroomconfig", //获取房间配置
    GetAllRoomConfig: "allRoomConfig", //所有房间配置数据
    GetLoginInfo: "getloginInfo", //登录结果
    EnterGame: "enterGame", // 请求进入房间
    EnterRoom: "enterRoom", // 请求进入游戏
    SENDMSG_TIMEOUT: "sendmsg_timeout", //发送消息回传超时
    SENDMSG_CLOSESERVER: "sendmsg_closeserver",
    UPDATE_USERINFO: "update_userInfo", //更新玩家信息
    UPDATE_OnlineNum: "UPDATE_OnlineNum", //在线人数
    UPDATEHISTORY: "updatehistory",
    UPDATEBANKERLIST: "updatebankerlist",
    GetPassWord: "getPassWord", //找回密码
    GetGameSwitchNotice: "GetGameSwitchNotice", //获取游戏开关信息通知
    GetGameDomainNotice: "GetGameDomainNotice", //获取游戏路由信息通知
    UPDATE_MONEY: "UpdateMoney",
    //资源更新
    UPDATE_OK_MESSAGE: "UPDATE_OK_MESSAGE", //确定更新消息
    UPDATE_CANCEL_MESSAGE: "UPDATE_CANCEL_MESSAGE", //取消更新消息
    UPDATE_MESSAGE: "UPDATE_MESSAGE", //更新消息
    UPDATE_END_MESSAGE: "UPDATE_END_MESSAGE", //更新完成消息
    UPDATE_NOT_MESSAGE: "UPDATE_NOT_MESSAGE", //不需要更新消息
    UPDATE_NEED_MESSAGE: "UPDATE_NEED_MESSAGE" };

var HttpConfig = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new init();
        }
        return instance;
    };

    function init() {
        return {
            //cid: 141 ,
            //pid :window.PRODUCT_ID,
            //cctype : 2 ,
        };
    };
    return {
        getInstance: getInstance
    };
}();

module.exports = HttpConfig;