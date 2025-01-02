'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({

    extends: cc.Component,

    properties: {
        time: 0,
        timeLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    updateTimeLabel: function updateTimeLabel(label) {
        this.timeLabel.string = label;
        if (Number(label) <= 3 && this.node.active) {
            MusicMgr.playEffect(Audio_Common.AUDIO_TIME);
        }
    },

    setActive: function setActive(active) {
        this.node.active = active;
    }
});