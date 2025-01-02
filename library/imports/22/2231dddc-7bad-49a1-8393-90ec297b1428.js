'use strict';

/**
 * Created by shrimp on 17/4/26.
 */

var SocketManager = require('SocketManager');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');

function GloudVoice() {}

GloudVoice.prototype.onStartRecord = function (progress) {
    cc.log("GloudVoice.prototype.onStartRecord,progress = " + progress);
    //显示开始录音
    //SocketManager.getInstance().startSocket();
};

GloudVoice.prototype.onStopRecording = function (progress) {
    cc.log("GloudVoice.prototype.onStopRecording,progress = " + progress);
    //停止录音
    //SocketManager.getInstance().startSocket();
};

GloudVoice.prototype.OnUploadFile = function (code, filePath, fileID) {
    cc.log("GloudVoice.prototype.OnUploadFile,code = " + code);
    cc.log("GloudVoice.prototype.OnUploadFile,filePath = " + filePath);
    cc.log("GloudVoice.prototype.OnUploadFile,fileID = " + fileID);
    if (code == 11) {
        //上传服务器转发


        //var filePath = filePath + "@" + 1.0;
        var voiceData = {
            filePath: filePath,
            fileID: fileID
        };
        //Net.sendAudio(Table.getInstance().room_id, fileId, filePath);
        var data = {
            touid: GamePlayer.getInstance().uid,
            kind: ChatType.E_CHAT_VOICE_KIND,
            type: 0,
            text: BASE64.encoder(JSON.stringify(voiceData))
        };
        MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
    }

    //显示上传通知
};

GloudVoice.prototype.OnDownloadFile = function (code, filePath, fileID) {
    cc.log("GloudVoice.prototype.OnDownloadFile,code = " + code);
    cc.log("GloudVoice.prototype.OnDownloadFile,filePath = " + filePath);
    cc.log("GloudVoice.prototype.OnDownloadFile,fileID = " + fileID);
    if (code == 13 || code == 11) {} else {
        //取消播放;
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    }
};

GloudVoice.prototype.OnPlayRecordedFile = function (code, filePath) {
    cc.log("GloudVoice.prototype.OnPlayRecordedFile,code = " + code);
    cc.log("GloudVoice.prototype.OnPlayRecordedFile,filePath = " + filePath);
    if (code == 18) {
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    } else {
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    }
};

var GVoiceJsb = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new GloudVoice();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = GVoiceJsb;