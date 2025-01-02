'use strict';

var GameCallOC = require('GameCallOC');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Time: cc.Label,
        VoiceValue: [cc.Sprite]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.time = 30;
        this.startVoiceTime();
        GameCallOC.getInstance().StartRecord(30000);
    },

    startVoiceTime: function startVoiceTime() {
        this.schedule(this.updateVoiceTime, 1);
    },

    updateVoiceTime: function updateVoiceTime() {
        this.time--;
        this.Time.string = this.time + '"';
        this.updateVoiceValue();
        if (this.time == 0) {
            this.dismiss();
        }
    },

    setVoiceValue: function setVoiceValue(value) {
        for (var index = 0; index < 3; index++) {
            this.VoiceValue[index].node.active = index < value;
        }
    },

    updateVoiceValue: function updateVoiceValue() {
        for (var index = 0; index < 3; index++) {
            this.VoiceValue[index].node.active = index <= this.time % 3;
        }
    },

    dismiss: function dismiss() {
        cc.log("dismiss");
        GameCallOC.getInstance().StopRecording();
        this.unschedule(this.updateVoiceTime);
        this.node.removeFromParent(true);
    }
});