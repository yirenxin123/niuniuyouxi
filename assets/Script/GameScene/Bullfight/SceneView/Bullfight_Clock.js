var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem   = require('GameSystem');

cc.Class({

    extends: cc.Component,

    properties: {
        time : 0,
        timeLabel : cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    updateTimeLabel : function (label) {
        this.timeLabel.string = label;
        if(Number(label) <= 3 && this.node.active)
        {
        	MusicMgr.playEffect(Audio_Common.AUDIO_TIME);
        }

    },

    setActive : function (active) {
        this.node.active = active;
    },
});
