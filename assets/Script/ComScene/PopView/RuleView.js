var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));
        
        this.scaleTo(this.bg);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    callbackBtnClose : function()
    {
    	MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("RuleView : callbackBtnClose");
        this.dismiss();
    },
    
    checkEventsRule : function(event, customEventData){
        cc.log('RuleView : checkEventsRule,event = ' + event + ',customEventData =' + customEventData);
    },
});
