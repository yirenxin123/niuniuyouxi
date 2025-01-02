"use strict";

var BasePop = require("BasePop");
var GameSystem = require('GameSystem');
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var UtilTool = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        Title: cc.Label,
        Doc: cc.Label,
        Writer: cc.Label,
        Time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    callbackBtnClose: function callbackBtnClose() {
        cc.log('NoticeView : callbackBtnClose');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    setContent: function setContent() {
        // GameSystem.getInstance().notice.title,
        // GameSystem.getInstance().notice.writer
        // GameSystem.getInstance().notice.time
        this.Title.string = GameSystem.getInstance().notice.title + ":";
        this.Doc.string = GameSystem.getInstance().notice.doc;
        this.Writer.string = GameSystem.getInstance().notice.writer;
        this.Time.string = UtilTool.getFormatData(GameSystem.getInstance().notice.time);
    }

});