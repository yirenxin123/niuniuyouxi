/**
 * Created by shrimp on 17/2/19.
 */


var MessageFactory_Common = require('MessageFactory_Common') ;
var MessageFactory_Bullfight = require('MessageFactory_Bullfight');
var GameSystem = require('GameSystem');

var MessageFactory =
    {

    };

//生成一个基础消息
MessageFactory.createMessageReq = function(cmd){
    cc.log("MessageFactory.createMessageReq,cmd = " + cmd.toString(16));
    var message = null ;
    if(GameSystem.getInstance().CurGameType == GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT)
    {
        message = MessageFactory_Bullfight.createMessageReq(cmd);
    }
    else
    {
        // cc.error("MessageFactory.createMessage,ERROR,curGameType = " + curGameType);
    }

    //走公共协议
    if(message == null){
        message = MessageFactory_Common.createMessageReq(cmd);
    }

    if(message == null){
        cc.error("MessageFactory.createMessageReq,message = null");
    }
    cc.log("MessageFactory.createMessageReq," + message.constructor.name);
    return message;

};

MessageFactory.createMessageResp = function(cmd){
    cc.log("MessageFactory.createMessageResp,cmd = " + cmd.toString(16));
    var message = null ;
    if(GameSystem.getInstance().CurGameType == GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT ||1)
    {
        message = MessageFactory_Bullfight.createMessageResp(cmd);
    }
    else
    {
        // cc.error("MessageFactory.createMessage,ERROR,curGameType = " + curGameType);
    }

    //走公共协议
    if(message == null){
        message = MessageFactory_Common.createMessageResp(cmd);
    }

    if(message == null){
        cc.error("MessageFactory.createMessageResp,message = null");
    }
    cc.log("MessageFactory.createMessageResp," + message.constructor.name);
    return message;

};

module.exports = MessageFactory;