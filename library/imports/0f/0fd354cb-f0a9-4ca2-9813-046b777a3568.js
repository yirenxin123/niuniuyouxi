'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");
cc.Class({
    extends: cc.Component,

    properties: {
        BtnAgree: cc.Node,
        BtnRefuse: cc.Node,
        ReqMsg: cc.RichText,
        Time: cc.Label,
        Head: cc.Sprite,
        Title: cc.Label,
        RoomInfoView: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg = null;
        this.msgType = 0; // 非俱乐部消息
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (this.msgType == 3) {
                if (self.msg.deal == 0) {
                    if (self.msg.type == 3 || self.msg.type == 4) {
                        var data = {
                            type: self.msg.type,
                            msgid: self.msg.id
                        };
                        cc.log("read MsgId=", data.msgid, " type=", data.type);
                        MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
                    }
                } else {
                    cc.log("read MsgId=", data.msgid, " type=", data.type, " deal=", deal);
                }
            } else {
                // if(self.msg.type != 1)
                // {
                //     var data = {
                //         type: self.msg.type,
                //         msgid: self.msg.id,
                //     };
                //     MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
                // }
            }
        });
    },

    setMessageInfo: function setMessageInfo(msg, msgType) {
        cc.log("SitReqCell.setMessageInfo, msg= " + msg.msg);
        this.msg = msg;
        this.msgType = msgType;
        UpdateWXHeadIcon(msg.url, this.Head);

        if (this.msgType == 3) {
            //个人消息
            // Id      int    `json:"id"`
            // Deal    int    `json:"deal"`
            // Type    int    `json:"type"`
            // Url     string `json:"url"`
            // Name    string `json:"name"`
            // Msg     string `json:"msg"`
            // SendUid uint32 `json:"senduid"`
            // Time    int    `json:"time"`

            if (msg.type == 1) {
                this.setMsgSitReq(msg);
            } else if (msg.type == 3) {
                this.setMsgBuyProp(msg);
            } else if (msg.type == 4) {
                this.setMsgCharge(msg);
            }
        } else if (this.msgType == 2) {
            //俱乐部消息
            // Id     int    `json:"id"`
            // Deal   int    `json:"deal"`
            // Url    string `json:"url"`
            // Type   int    `json:"type"`
            // Name   string `json:"name"`
            // Msg    string `json:"msg"`
            // ClubId int    `json:"clubid"`
            // Time   int    `json:"time"`

            if (msg.type == 1) {
                this.setMsgJoinClub(msg);
            } else {
                this.setMsgClubOtherMsg(msg);
            }
        }
        this.Time.string = UtilTool.getFormatData(msg.time);
    },

    setMsgJoinClub: function setMsgJoinClub(msg) {
        cc.log("setMsgJoinClub msg=", msg);

        this.Title.string = "申请加入";
        if (msg.deal == 0) {
            this.ReqMsg.string = "<color=#646464>" + msg.msg.name + "(" + msg.msg.uid + ")申请加入" + "您<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            this.BtnAgree.active = true;
            this.BtnRefuse.active = true;
        } else {
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
            if (msg.deal == 1) {
                this.ReqMsg.string = "<color=#646464>您<color=#FF0000>同意</c>" + msg.msg.name + "(" + msg.msg.uid + ")加入" + "<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            } else {
                this.ReqMsg.string = "<color=#646464>您<color=#FF0000>拒绝</c>" + msg.msg.name + "(" + msg.msg.uid + ")加入" + "<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            }
        }
    },

    setMsgClubOtherMsg: function setMsgClubOtherMsg(msg) {
        switch (msg.type) {
            case 2:
                this.Title.string = "申请加入";
                break;

            case 3:
                this.Title.string = "创建俱乐部";
                break;

            case 4:
                this.Title.string = "解散俱乐部";
                break;

            case 5:
                this.Title.string = "升级俱乐部";
                break;

            case 7:
                this.Title.string = "修改管理员";
                break;

            case 8:
                this.Title.string = "删除成员";
                break;
        }

        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgCharge: function setMsgCharge(msg) {
        this.Title.string = "充值消息";
        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgBuyProp: function setMsgBuyProp(msg) {
        this.Title.string = "道具消息";
        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgSitReq: function setMsgSitReq(msg) {
        cc.log("setMsgSitReq msg=", msg);
        this.Title.string = "牌局消息";
        if (msg.deal == 0) {
            this.ReqMsg.string = "<color=#646464>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = true;
            this.BtnRefuse.active = true;
        } else if (msg.deal == 1) {
            this.ReqMsg.string = "<color=#646464>您<color=#FF0000>同意</c>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
        } else {
            this.ReqMsg.string = "<color=#646464>您<color=#FF0000>拒绝</c>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("SitReqCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("SitReqCell.callbackBtn,btnName = " + btnName);
        if (btnName == "BtnAgree") {
            if (this.msgType == 3) {
                //个人消息
                if (this.msg.type == 1) {
                    this.sendSitMessage(1); //同意
                    this.msg.deal = 1;
                    this.setMsgSitReq(this.msg);
                }
            } else {
                if (this.msg.type == 1) {
                    this.sendAddClubMessage(1);
                    this.msg.deal = 1;
                    this.setMsgJoinClub(this.msg);
                }
            }
        } else if (btnName == "BtnRefuse") {
            if (this.msgType == 3) {
                if (this.msg.type == 1) {
                    this.sendSitMessage(2); //拒绝
                    this.msg.deal = 2;
                    this.setMsgSitReq(this.msg);
                }
            } else {
                if (this.msg.type == 1) {
                    this.sendAddClubMessage(2);
                    this.msg.deal = 2;
                    this.setMsgJoinClub(this.msg);
                }
            }
        }
    },

    sendAddClubMessage: function sendAddClubMessage(result) {
        cc.log("SitReqCell.sendAddClubMessage ClubId=", this.msg.clubid, " uid=", this.msg.msg.uid, " result=", result);
        var data = {
            uid: this.msg.msg.uid,
            isallow: result };
        cc.log("BaseScene.notifyOwnerConfirmSit.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.CLUB_REQ_OWNER_CONFIRM_CMD_ID).send(data, this.msg.clubid);
    },

    // SitUid     uint32 `json:"situid"`      //申请入座的玩家uid
    // Name       string `json:"name"`        //玩家昵称
    // SeatId     int    `json:"seatid"`      //申请入座的座位号
    // Coin       int    `json:"coin"`        //申请携带金币
    // GameSvcId  uint32 `json:"gamesvcid"`   //在哪一个游戏服务器申请
    // TableId    int32  `json:"tableid"`     //在哪一个桌子申请
    // PrivateId  int    `json:"privateid"`   //6位数私人桌id
    // CreateTime int64  `json:"createtime"`  //创建时间
    sendSitMessage: function sendSitMessage(result) {
        var msg = this.msg.msg;
        var data = {
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.situid,
            privateid: msg.privateid,
            result: result };
        cc.log("sendSitMessage.SitReqCell data=", data);
        MessageFactory.createMessageReq(window.US_REQ_OWNER_CONFIRM_CMD_ID).send(data);
    }
});