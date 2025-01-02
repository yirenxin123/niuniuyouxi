'use strict';

//var AudioManager = require('AudioManager');
var GameSystem = require('GameSystem');

cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 0.9,
        transDuration: 0.05,

        playColseEffect: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.m_tmLastClicked = 0;
        this.m_DelayInteractable = false; //延时不可点击
        this.countTime = 0;

        this.pressedScale = 0.9;
        this.transDuration = 0.03;
        var self = this;

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
            if (!self.button.interactable || self.m_DelayInteractable) {
                return;
            }
            this.stopAllActions();
            this.runAction(self.scaleDownAction);

            if (self.playColseEffect) {
                //AudioManager.playEffect("resources/common/music/click_close.mp3") ;
            } else {
                    //AudioManager.playEffect("resources/common/music/click.mp3") ;
                }

            if (self.isDelayHandleEvent()) {
                cc.log("----------------isDelayHandleEvent-------");
                self.button.interactable = false;
                self.m_DelayInteractable = true;
            }
        }
        function onTouchUp(event) {
            if (!self.button.interactable) {
                return;
            }
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    },

    update: function update(dt) {
        if (this.m_DelayInteractable) {
            this.countTime += dt;
            // cc.log("-----------m_DelayInteractable------------" + this.countTime);
            if (this.countTime > 0.5) {
                this.countTime = 0;
                this.button.interactable = true;
                this.m_DelayInteractable = false;
            }
        }
    },

    //延时处理
    isDelayHandleEvent: function isDelayHandleEvent(iDelaySeconds) {
        //1秒钟只能点击一次
        if (iDelaySeconds == undefined) {
            iDelaySeconds = 600;
        }
        var tmNow = GameSystem.getInstance().getCurrentSystemTime();
        if (tmNow - this.m_tmLastClicked <= iDelaySeconds) {
            return true;
        }
        this.m_tmLastClicked = tmNow;
        return false;
    }
});