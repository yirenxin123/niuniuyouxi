"use strict";

var Tview = cc.Class({
    extends: cc.Component,

    properties: {
        tipText: null,
        viewNode: null
    },

    show: function show(tips, delayTime) {

        if (tips == "") {
            return;
        }
        var self = this;

        window.loadPrefabs("prefabs/toastView", function (newNode) {
            self.updateView(newNode, tips, delayTime);
        });
    },

    updateView: function updateView(newNode, tips, delayTime) {
        var self = this;
        if (delayTime === undefined) {
            delayTime = 1;
        }
        this.viewNode = newNode;

        this.tipText = cc.find("txt", newNode).getComponent(cc.Label);
        var bg = cc.find("bg", newNode);
        var lableText = cc.find("txt", newNode);
        this.tipText.string = tips;

        var width = lableText.width + 40 < bg.width ? bg.width : lableText.width + 40;

        var height = lableText.height + 30 < bg.height ? bg.height : lableText.height + 30;

        // newNode.scaleX = width/bg.width;
        // newNode.scaleY = height/bg.height;
        bg.setContentSize(width, height);
        // bg.width = width;
        // bg.height = height ;

        var fadeIn = cc.fadeIn(0.5);
        var delay = cc.delayTime(delayTime);
        var fadeOut = cc.fadeOut(0.5);

        var actionall = cc.sequence(fadeIn, delay, fadeOut, cc.callFunc(this.dismiss, this));
        this.viewNode.runAction(actionall);

        window.scaleTo(newNode);
    },

    setTips: function setTips(tips) {
        if (this.tipText != undefined) {
            this.tipText.string = tips;
        }
    },

    dismiss: function dismiss() {
        if (this.viewNode != null) {
            this.viewNode.removeFromParent(true);
            this.viewNode = null;
        }
    },

    removeFromParent: function removeFromParent(flag) {
        this.dismiss();
    }

});

var ToastView = {

    show: function show(tips, delayTime) {
        this.view = new Tview();
        this.view.show(tips, delayTime);
        return this.view;
    }

};

module.exports = ToastView;