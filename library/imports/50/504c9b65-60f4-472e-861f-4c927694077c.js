"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        Slider: cc.Slider,
        Bar: cc.ProgressBar,
        Label: cc.Label,
        MaxLabel: cc.Label,
        MinLabel: cc.Label,
        iMax: 0,
        iMin: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    getNumFromCurNum: function getNumFromCurNum(num) {
        var targetNum = num;
        var num1 = num % 100;
        if (num1 >= 50) {
            targetNum = num + (100 - num1);
        } else {
            targetNum = num - num1;
        }

        if (targetNum > this.iMax) {
            targetNum = this.iMax;
        } else if (targetNum < this.iMin) {
            targetNum = this.iMin;
        }

        var progress = (targetNum - this.iMin) / (this.iMax - this.iMin);
        this.Bar.progress = progress;
        this.Slider.progress = progress;

        return targetNum;
    },

    setMinAndMax: function setMinAndMax(min, max) {
        this.iMax = max;
        this.iMin = min;
        this.MaxLabel.string = this.iMax;
        this.MinLabel.string = this.iMin;
        this.Bar.progress = this.Slider.progress;
        var num = parseInt(this.iMin + (this.iMax - this.iMin) * this.Slider.progress);
        this.CurCarryNum = this.getNumFromCurNum(num);
        this.Label.string = this.CurCarryNum;
    },

    callBackSlider: function callBackSlider(slider, customEventData) {
        this.Bar.progress = this.Slider.progress;
        var num = parseInt(this.iMin + (this.iMax - this.iMin) * this.Slider.progress);
        this.CurCarryNum = this.getNumFromCurNum(num);
        this.Label.string = this.CurCarryNum;
        this.Label.string = this.CurCarryNum;
    }
});