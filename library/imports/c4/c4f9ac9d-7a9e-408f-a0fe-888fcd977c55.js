'use strict';

var BaseView = require("BaseView");
var MessageFactory = require('MessageFactory');
var SocketManager = require('SocketManager');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var GameSystem = require('GameSystem');
var GamePlayer = require('GamePlayer');
var LoadingView = require('LoadingView');

cc.Class({
    extends: cc.Component,

    // properties:
    // {
    //     m_sendHeartBeat        : true ,
    // },

    initBaseInfo: function initBaseInfo() {
        this.pToastView = null;
        this.m_pNetAlert = null;
        this.changeHouTai = false;

        this.bBeginHeart = false;
        this.NowReconnect = false;
        this.isGaming = false;

        this.netReStartCnt = 0;
        this.netCount = 0;
        this.netTimeTotal = 0;
        this.disNetTime = 0;
        this.netStrength = 0;
        this.m_llSendTime = 0, this.localMessageListenerID = 0;
        this.httpMessageListenerID = 0;
        this.socketMessageListenerID = 0;
        this.GameInfoListenerID = 0;

        this.m_isNetConnecting = true;

        this.isOnLine = true;
        this.onGameBack = false;
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("BaseScene.onLoad");
        this.initBaseInfo();
        //socket消息
        this.addSocketListener();
        //http消息
        this.addHttpListener();
        //本地消息监听
        this.addLocalMessageListener();
        //引擎信息
        this.addGameInfoListener();

        //场景切换需要重新设置心跳
        if (SocketManager.getInstance().isConnected()) {
            this.startHeartBeat();
        }
    },

    onDestroy: function onDestroy() {
        cc.log("BaseScene.onDestroy");
        this.unschedule(this.sendHeartBeat);

        GlobalEventManager.getInstance().removeListener(this.httpMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.localMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.GameInfoListenerID);
    },

    addGameInfoListener: function addGameInfoListener() {
        cc.log("BaseScene.addGameInfoListener");
        var self = this;
        this.GameInfoListenerID = window.GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo, function (event) {
            if (event) {
                var tag = event.tag;
                if (tag == window.GameInfo.GameHide) {
                    self.onPause();
                } else if (tag == window.GameInfo.GameShow) {
                    self.onResume();
                } else if (tag == window.GameInfo.NetOnline) {
                    self.onNetOnline();
                } else if (tag == window.GameInfo.NetOffline) {
                    self.onNetOffline();
                }
            }
        }, this);
    },

    onPause: function onPause() {
        cc.warn("游戏暂停");
        this.onGameBack = true;
        cc.audioEngine.pauseAll();
        cc.game.pause();
        SocketManager.getInstance().disconnect();
    },

    onResume: function onResume() {
        cc.warn("游戏恢复");
        this.onGameBack = false;
        cc.audioEngine.resumeAll();
        cc.game.resume();
        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                this.changeHouTai = true;
                SocketManager.getInstance().reStartSocket();
            }
        }
    },

    onNetOffline: function onNetOffline() {

        cc.warn("网络断开");
        this.isOnLine = false;
        // SocketManager.getInstance().disconnect();
        // ToastView.show("网络连接中断，请检查网络!")
    },

    onNetOnline: function onNetOnline() {
        cc.warn("网络恢复");
        this.isOnLine = true;
        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                this.changeHouTai = true;
                SocketManager.getInstance().reStartSocket();
                // ToastView.show("网络恢复，重新连接服务器")
            }
            //ShopModel.getInstance().updateUserInfo();
        }
        // ToastView.show("网络恢复")
    },

    update: function update(dt) {},

    //socket消息
    addSocketListener: function addSocketListener() {
        cc.log("BaseScene.addSocketListener");
        var self = this;
        this.socketMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.SocketMessage, function (event) {

            if (event == undefined) {
                return;
            }
            var type = event.tag;
            //连接服务器成功
            if (type == window.MessageType.SOCKET_CONNECTED) {
                self.onSocketConnected();
            }
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {
                    self.onSocketDisconnected();
                }
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {
                        self.onSocketConnecting();
                    }
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {
                                self.onMessage(event);
                            } else if (type == window.MessageType.SCENE_MSG) {
                                self.onSceneMsg(event);
                            }
        }, this);
    },

    //http消息监听
    addHttpListener: function addHttpListener() {
        cc.log("BaseScene.addHttpListener");
        var self = this;

        this.httpMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.HttpMessage, function (event) {
            if (event == undefined) {
                return;
            }

            var tag = event.tag;

            if (tag == window.HttpMessageType.HTTP_NOTIFICATION) {
                self.onHttpResponse(event.msg);
            } else if (tag == window.HttpMessageType.NOTIFY_HTTP_RSP_ERROR) {}
        }, this);
    },

    //本地消息监听
    addLocalMessageListener: function addLocalMessageListener() {
        cc.log("BaseScene.addLocalMessageListener");
        var self = this;
        this.localMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.LocalMessage, function (event) {
            if (event) {
                self.onLocalMessage(event);
            }
        }, this);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        //cc.log()
        switch (cmd) {
            case window.US_RESP_LOGIN_CMD_ID:
                //this.callUpdateMoney();
                break;

            case window.US_KICK_OUT_CMD_ID:
                this.createAlertView(msg.desc);
                break;

            case window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID:
                this.notifyOwnerConfirmSit(msg);
                break;

            case window.US_RESP_OWNER_CONFIRM_CMD_ID:
                this.OwnerConfirmSit(msg);
                break;

            case window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID:
                this.onNotifyOwnerTableOver(msg);
                break;

            case window.US_RESP_FIND_TABLE_CMD_ID:
                this.onFindRoom(msg);
                break;

            case window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID:
                this.onClubAddMsg(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onClubRmMem(msg);
                break;

            case window.US_RESP_EXCHANGE_GOLD_CMD_ID:
                this.onExchangeGoldMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.onUserDetail(msg);
                break;

            case US_NOTIFY_PAY_OPERATE_CMD_ID:
                this.onPayResult(msg);
                break;

            case window.US_NOTIFY_IN_GAME_CMD_ID:
                this.notifyInGame(msg);
                break;

            case window.US_RESP_CREATE_COST_CMD_ID:
                this.onCreateTableCost(msg);
                break;

            case window.US_RESP_CLUB_UPGRADE_COST_CMD_ID:
                this.onClubUpgradeCost(msg);
                break;

            case US_RESP_NEW_MSG_NUM_CMD_ID:
                this.onMimeMsgNum(msg);
                break;
            case US_RESP_BIND_REFERRAL_CMD_ID:
                this.onBingReferral(msg);
                break;
        }
        /*
        * RET_REPEAT_REGISTER         : -1000, //服务器重复注册(服务器内部消息)
         RET_NOT_CALL_BANKER         : -19,   //非抢庄状态
         RET_USER_OFFLINE            : -18,   //玩家离线
         RET_NOT_CLICK_AGAIN         : -17,   //请勿频繁点击
         RET_SEAT_HAVE_PLAYER        : -16,   //您选择的座位已经被占领,请从新选择
         RET_SEAT_NOT_EXIST          : -15,   //您选择的座位不存在
         RET_PLAYER_ACTIVE           : -14,   //您正在游戏中,不能离开
         RET_PLAYER_HAVE_LEAVE       : -13,   //您已经离开
         RET_PARAM_ERROR             : -12,   //参数错误
         RET_DESTROYED_PRIVATE_TBALE : -11,   //牌局已销毁
         RET_TABLE_FULL              : -10,   //私人房爆满
         RET_GAME_PLAYER_FULL        : -9,    //桌子里面的玩家已满
         RET_GAME_TABLE_FULL         : -8,    //游戏服务器桌子爆满
         RET_DB_ERROR                : -7,    //数据库错误
         RET_NOT_FIND_TABLE          : -6,    //桌子不存在
         RET_NOT_FIND_GAME_SERVER    : -5,    //未找到匹配服务器
         RET_SERVER_ABNORMAL         : -4,    //服务异常
         RET_USER_REPEAT_LOGIN       : -3,    //您的账号已经在其他地点登录
         RET_USERKEY_ERROR           : -2,    //用户验证失败,请重新登录
         RET_ILLEGAL_REQ             : -1,    //非法请求(如:如果头部uid,不是自己的socket链接的uid就直接返回,反漏洞)
        * */

        if (msg.code < SocketRetCode.RET_SUCCESS) {
            if (msg.code == SocketRetCode.RET_NOT_FIND_GAME_SERVER || msg.code == SocketRetCode.RET_NOT_FIND_TABLE || msg.code == SocketRetCode.RET_PARAM_ERROR) {
                cc.director.loadScene('HallScene');
            } else if (msg.code == SocketRetCode.RET_ILLEGAL_REQ || msg.code == SocketRetCode.RET_SERVER_ABNORMAL) {
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    cc.director.loadScene('LoadingScene');
                }, "退出游戏");
                this.unschedule(this.sendHeartBeat);
                SocketManager.getInstance().disconnect();
                alert.show(msg.desc + ",请退出游戏重新进入！", AlertViewBtnType.E_BTN_CLOSE);
            } else if (msg.code == SocketRetCode.RET_USERKEY_ERROR || msg.code == SocketRetCode.RET_USER_REPEAT_LOGIN) {
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    cc.director.loadScene('LoadingScene');
                }, "退出游戏");
                this.unschedule(this.sendHeartBeat);
                SocketManager.getInstance().disconnect();
                alert.show(msg.desc + ",请退出游戏重新进入！", AlertViewBtnType.E_BTN_CLOSE);
            } else {
                this.createAlertView(msg.desc);
            }
            LoadingView.dismiss();
        }
    },

    onBingReferral: function onBingReferral(msg) {

        if (msg.code < SocketRetCode.RET_SUCCESS) return;
        GameSystem.getInstance().referralCode = msg.referralid;
        ToastView.show("绑定成功");
    },

    onPayResult: function onPayResult(msg) {
        var alert = AlertView.create();
        // alert.show("您花费了¥" + msg.param.cost + "购买了" + msg.param.opdiamond + "个钻石，已成功到账", AlertViewBtnType.E_BTN_CLOSE);
        alert.show(msg.param.desc);
        this.getUserDetail();
    },

    onCreateTableCost: function onCreateTableCost(msg) {
        cc.log("HallScene.onCreateTableCost code=", msg.code);
        if (msg.code != SocketRetCode.RET_SUCCESS) return;
        GameSystem.getInstance().BullFightTableCost = msg.list;
    },

    onClubUpgradeCost: function onClubUpgradeCost(msg) {
        cc.log("HallScene.onClubUpgradeCost code=", msg.code);
        if (msg.code = SocketRetCode.RET_SUCCESS) return;

        GameSystem.getInstance().ClubUpgradeCost = msg.list;
        cc.log("HallScene.onClubUpgradeCost list=", msg.list);
    },

    onMimeMsgNum: function onMimeMsgNum(msg) {
        GameSystem.getInstance().NewMsgNum = false;
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.sysnum > 0 || msg.clubnum > 0 || msg.mailnum > 0) {
                GameSystem.getInstance().NewMsgNum = true;
            }
        }
        cc.log("onMimeMsgNum sysnum=", msg.sysnum, " clubnum=", msg.clubnum, " mailnum=", msg.mailnum);
    },

    onUserDetail: function onUserDetail(msg) {
        cc.log("HallScene.onUserDetail");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
    },

    onExchangeGoldMsg: function onExchangeGoldMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var alert = AlertView.create();
            alert.show(msg.tips, AlertViewBtnType.E_BTN_CLOSE);
            this.getUserDetail();
        }
    },

    onClubAddMsg: function onClubAddMsg(msg) {
        var self = this;

        var uid = msg.param.uid;
        var name = msg.param.name;
        var clubname = msg.param.clubname;
        var alert = AlertView.create();
        alert.setPositiveButton(function () {
            self.sendClubOwnerConfirm(1, uid, msg.clubid);
        }, "同意");
        alert.setNegativeButton(function () {
            self.sendClubOwnerConfirm(0, uid, msg.clubid);
        }, "拒绝");

        alert.show(name + "(" + msg.param.uid + ")" + "申请加入您的'" + clubname + "'俱乐部，是否同意？", AlertViewBtnType.E_BTN_CANCLE);
    },

    onClubRmMem: function onClubRmMem(msg) {
        if (msg.param.uid == GamePlayer.getInstance().uid) {
            ToastView.show("您被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        } else {
            ToastView.show(msg.param.name + "被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        }
    },

    sendClubOwnerConfirm: function sendClubOwnerConfirm(result, uid, clubid) {
        var data = {
            uid: uid,
            isallow: result };
        cc.log("BaseScene.notifyOwnerConfirmSit.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.CLUB_REQ_OWNER_CONFIRM_CMD_ID).send(data, clubid);
    },

    notifyInGame: function notifyInGame(msg) {
        cc.log("BaseScene.notifyInGame, msg" + msg.gamesvcid + ",tableid" + msg.tableid);
        if (msg.code > 0) {
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;
            cc.director.loadScene('Bullfight_GameScene');
        }
    },

    onFindRoom: function onFindRoom(msg) {
        cc.log("HallScene.onFindRoom,msg" + msg.gamesvcid + ",tableid" + msg.tableid);
        LoadingView.dismiss();
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;

            cc.director.loadScene('Bullfight_GameScene');
        }
    },

    onNotifyOwnerTableOver: function onNotifyOwnerTableOver(msg) {
        cc.log("BaseScene.onNotifyOwnerTableOver");

        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var data = {
                gamesvcid: msg.gamesvcid,
                tableid: msg.tableid,
                privateid: msg.privateid
            };

            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                self.sendFindTable(1, data);
            }, "进入游戏");
            alert.setNegativeButton(function () {}, "取消");

            alert.show("房间：" + msg.tableid + "(" + msg.tablename + "),剩余" + msg.remaintime + "秒就要结束了，是否立刻进入房间？", AlertViewBtnType.E_BTN_CANCLE);
        }
    },

    sendFindTable: function sendFindTable(data) {
        cc.log("BaseScene.sendFindTable,roomId = " + data.privateid);
        var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid: data.privateid
        };
        if (createRoom) {
            createRoom.send(data);
        }
    },

    notifyOwnerConfirmSit: function notifyOwnerConfirmSit(msg) {
        cc.log("BaseScene.notifyOwnerConfirmSit,msg = " + msg.gamesvcid);

        var self = this;

        var data = {
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.sitUid,
            privateid: msg.privateid
        };

        var alert = AlertView.create();
        alert.setPositiveButton(function () {
            self.sendOwnerConfirm(1, data);
        }, "同意");
        alert.setNegativeButton(function () {
            self.sendOwnerConfirm(2, data);
        }, "拒绝");

        var show = msg.name + "(" + msg.sitUid + ")申请携带" + msg.coin + "牛友币进入您" + msg.privateid + "(" + msg.tablename + ")牌局,是否同意?";

        alert.show(show, AlertViewBtnType.E_BTN_CANCLE);
    },

    sendOwnerConfirm: function sendOwnerConfirm(result, data) {
        var data = {
            gamesvcid: data.gamesvcid,
            tableid: data.tableid,
            playeruid: data.playeruid,
            privateid: data.privateid,
            result: result };

        cc.log("BaseScene.sendOwnerConfirm.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.US_REQ_OWNER_CONFIRM_CMD_ID).send(data);
    },

    OwnerConfirmSit: function OwnerConfirmSit(msg) {
        cc.log("BaseScene.OwnerConfirmSit");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    createAlertView: function createAlertView(desc) {
        cc.log("BaseScene.createAlertView,desc = " + desc);
        ToastView.show(desc, 2);
    },

    onLocalMessage: function onLocalMessage(event) {
        cc.log("BaseScene.onLocalMessage");
        if (event == undefined) {
            return;
        }
        var tag = event.tag;

        if (tag == window.LocalMsgType.SENDMSG_TIMEOUT) {
            this.msgSendTimeOut();
        } else if (tag == window.LocalMsgType.UPDATE_USERINFO) {}
    },

    onHttpResponse: function onHttpResponse(event) {
        cc.log("BaseScene.onHttpResponse");
        if (!event.isSucceed) {
            return;
        }
    },

    reStartSocket: function reStartSocket() {
        cc.log("BaseScene.reStartSocket");
        this.m_llSendTime = -1;
        SocketManager.getInstance().reStartSocket();
    },

    startHeartBeat: function startHeartBeat() {
        cc.log("BaseScene.startHeartBeat");
        this.schedule(this.sendHeartBeat, window.HEART_BEAT_TIME);
    },

    sendHeartBeat: function sendHeartBeat() {
        cc.log("BaseScene.sendHeartBeat");
        if (SocketManager.getInstance().isConnected()) {
            var msg = MessageFactory.createMessageReq(window.US_REQ_HEARTBEAT_CMD_ID);
            if (msg) {
                this.m_llSendTime = new Date().getTime();;
                msg.send();
                this.bBeginHeart = true;
            } else {
                cc.log("BaseScene.sendHeartBeat,msg = null");
            }
        } else {
            cc.warn("BaseScene.sendHeartBeat,服务器尚未连接，心跳发送失败");
        }
    },

    onCheckNetReStart: function onCheckNetReStart() {
        cc.log("BaseScene.onCheckNetReStart");
        this.netReStartCnt++;
        if (this.netReStartCnt % 6 == 0) {
            this.reStartSocket();
        }

        if (this.netReStartCnt == 18) {
            this.netReStartCnt = 0;
            GlobalEventManager.getInstance().emitEvent(window.LocalMessage, { tag: window.LocalMsgType.SENDMSG_TIMEOUT });
            this.unschedule(this.onCheckNetReStart);
        }
    },

    msgSendTimeOut: function msgSendTimeOut() {
        cc.log("BaseScene.msgSendTimeOut");
        this.reconnect_times = 5;
        this.reStartSocket();

        this.unschedule(this.sendHeartBeat);

        this.NowReconnect = true;
        var text = "您的网络连接超时，正在疯狂尝试恢复" + 6;
        this.pToastView = ToastView.show(text, 6);

        this.disNetTime = 6;
        this._dNetCount = 0;
        this.schedule(this.reDisConTime, 1);
    },

    reDisConTime: function reDisConTime() {
        cc.log("BaseScene.reDisConTime");
        if (this.pToastView) {
            this.disNetTime -= 1;
            var text = "您的网络连接超时，正在疯狂尝试恢复 " + this.disNetTime;
            //this.pToastView.setTips(text);
            this._dNetCount++;

            if (this.disNetTime <= 0) {
                this.unschedule(this.reDisConTime);
                this.pToastView.removeFromParent(true);
                this.pToastView = null;
                this.reconnect_times = 5;

                this.m_pNetAlert = AlertView.create();

                this.m_pNetAlert.setPositiveButton(this.replyReConnectYes);
                this.m_pNetAlert.setNegativeButton(this.replyReConnectNo);
                this.m_pNetAlert.show("网络连接超时，您需要继续恢复游戏吗？", AlertViewBtnType.E_BTN_CANCLE, this);
            }
        }
    },

    replyReConnectYes: function replyReConnectYes() {
        cc.log("BaseScene.replyReConnectYes");
        this.m_pNetAlert = null;
        GlobalEventManager.getInstance().emitEvent(window.LocalMessage, { tag: window.LocalMsgType.SENDMSG_TIMEOUT });
    },

    replyReConnectNo: function replyReConnectNo() {
        cc.log("BaseScene.replyReConnectNo");
        cc.director.loadScene('hall');
    },

    sendLoginHall: function sendLoginHall() {
        cc.log("BaseScene.sendLoginHall");
        var login = MessageFactory.createMessageReq(window.US_REQ_LOGIN_CMD_ID);
        if (login) {
            login.send();
        }
    },

    getUserDetail: function getUserDetail() {
        cc.log("BaseScene.getUserDetail");
        var detail = MessageFactory.createMessageReq(window.US_REQ_USER_DETAIL_CMD_ID);
        if (detail) {
            detail.send();
        }
    },

    onSocketDisconnected: function onSocketDisconnected() {
        cc.log("BaseScene.onSocketDisconnected");
        this.unschedule(this.sendHeartBeat);

        if (!this.onGameBack) {
            this.scheduleOnce(this.callLoginServer, 1);
        }
    },

    onSocketConnecting: function onSocketConnecting() {
        cc.log("BaseScene.onSocketConnecting");
        this.unschedule(this.sendHeartBeat);
        ToastView.show("连接中..."); //
    },

    onSocketConnected: function onSocketConnected() {
        cc.log("BaseScene.onSocketConnected");
        this.unschedule(this.callLoginServer);
        this.reconnect_times = 5;
        this.NowReconnect = false;

        this.sendLoginHall();

        this.startHeartBeat();

        this.unschedule(this.waitReConnect);
        this.unschedule(this.reDisConTime);
        this.unschedule(this.onCheckNetReStart);
        this.unschedule(this.reAllDisConTime);

        if (this.pToastView) {
            this.pToastView.removeFromParent(true);
            this.pToastView = null;

            ToastView.show("连接成功，正在回到游戏");
        } else {
            if (this.changeHouTai) {
                this.changeHouTai = false;
                ToastView.show("连接成功");
            }
        }

        if (this.m_pNetAlert) {
            this.m_pNetAlert.removeFromParent(true);
            this.m_pNetAlert = null;
        }
    },

    waitReConnect: function waitReConnect() {},

    reAllDisConTime: function reAllDisConTime() {
        cc.log("BaseScene.reAllDisConTime");
        if (this.m_pNetAlert) {
            this.m_pNetAlert.removeFromParent(true);
            this.m_pNetAlert = null;
        }

        // var pAlert = AlertView.create();
        // pAlert.setPositiveButton(this.replyReConnectNo);
        // pAlert.show("您的游戏由于短线而中断，无法重新连接到游戏？", this);
        // this.scheduleOnce(this.gotoHallUpdate, 2);
    },

    gotoHallUpdate: function gotoHallUpdate() {
        cc.log("BaseScene.gotoHallUpdate");
        this.unschedule(this.gotoHallUpdate);
        this.NowReconnect = false;
        cc.director.loadScene("hall");
        this.bCheckConnect = true;
    },
    onUpdateUserInfo: function onUpdateUserInfo() {
        // var money = GamePlayer.getInstance().Money() ;
        // GamePlayer.getInstance().SetMoney(money);

    },

    UpdateDeviceStatus: function UpdateDeviceStatus() {},

    updatePlayerMoney: function updatePlayerMoney(msg) {
        // if (msg.ret.retCode >= window.RET_OK)
        // {
        //     if(msg.uid == GamePlayer.getInstance().uid)
        //     {
        //         if(msg.type == 1)
        //         {
        //             GamePlayer.getInstance().SetMoney(msg.money);
        //         }
        //         else if(msg.type == 2)
        //         {
        //             GamePlayer.getInstance().freezemoney = msg.money;
        //         }

        //         GlobalEventManager.getInstance().emitEvent(window.LocalMessage,{tag:window.LocalMsgType.UPDATE_USERINFO});
        //     }

        // }
    },
    updateHeartBeat: function updateHeartBeat(msg) {
        var netDelta = new Date().getTime - this.m_llSendTime;
        this.netTimeTotal += netDelta;
        this.netCount++;

        if (this.netCount > 5) {
            //  this.sendNetStrength(this.netTimeTotal);
            this.netTimeTotal = 0;
            this.netCount = 0;
        }

        this.bBeginHeart = false;
    },

    updateOfflineReult: function updateOfflineReult(msg) {
        // OfflineResultPacket* packet = (OfflineResultPacket*)msg;
        // if (msg.ret.retCode == window.RET_OK)
        // {
        //     if(0 != msg.isWin)
        //     {

        //         var strMsg = msg.strInfo.msg;

        //         var alert = AlertView.create();
        //         alert.setPositiveButton();
        //         alert.show(strMsg,"txz.png",false,null,true, packet.isWin);

        //     }
        // }
    },

    callUpdateMoney: function callUpdateMoney() {
        //update money
        // var msg = MessageFactory.createCommonMessage(window.UPDATE_PLAYER_MONEY);
        // if(msg){
        //     msg.send(1);
        // }
    },

    callLoginServer: function callLoginServer() {

        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                cc.log("LoadingView.callbackBtnLogin callLoginServer");
                SocketManager.getInstance().startSocket();
            }
        }
    }

});