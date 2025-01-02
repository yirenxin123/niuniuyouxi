'use strict';

window.AlertViewBtnType = cc.Enum({
    E_BTN_CLOSE: 0, //关闭和确定按钮
    E_BTN_CANCLE: 1 });

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

function AView() {

    this.rootNode = null;
    this.btnTypeFlag = AlertViewBtnType.E_BTN_CLOSE;
    this._positiveFlag = false;
    this._negativeFlag = false;
    this._callbackPositive = null;
    this._callbackNegative = null;
    this.positive = null;
    this.negative = null;
    this.positive_single = null;
    this.btnclose = null;
    this.positiveName = "";
    this.negativeName = "";

    this.positiveBtResNormal = null;

    this.reSet = function () {
        this.btnTypeFlag = AlertViewBtnType.E_BTN_CLOSE;
        this._positiveFlag = false;
        this._negativeFlag = false;
        this._callbackPositive = null;
        this._callbackNegative = null;
        this.positive = null;
        this.negative = null;
        this.positive_single = null;
        this.btnclose = null;
        this.positiveName = "";
        this.negativeName = "";
    };

    this.dismiss = function () {

        if (this.rootNode) {
            this.reSet();
            this.rootNode.removeFromParent(true);
            this.rootNode = null;
        }
    };

    this.show = function (tips, btnType, parent, tag) {
        this.dismiss();
        var self = this;

        window.loadPrefabs("prefabs/alertView", function (view) {

            self.rootNode = view;
            self.updateView(view, tips, btnType, parent);
            if (tag != undefined) {
                self.rootNode.tag = tag;
            }
        }, parent);
    };

    this.showOne = function (tips, btnType, parent) {
        if (parent) {
            parent.removeChildByTag(-100);
        } else {
            cc.director.getScene().removeChildByTag(-100);
        }
        this.show(tips, btnType, parent, -100);
    };

    this.updateView = function (node, tips, btnType, parent) {
        var self = this;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
            return;
        });

        this.btnTypeFlag = btnType;

        if (tips == "" || tips === undefined) {
            tips = "未知错误";
        }

        var desTxt = cc.find("Bg/Content", node).getComponent(cc.Label);

        desTxt.string = tips;
        this.positive_single = cc.find("Bg/BtnSureSingle", node);
        this.negative = cc.find("Bg/BtnCancle", node);
        this.positive = cc.find("Bg/BtnSure", node);
        this.btnclose = cc.find("Bg/BtnClose", node);
        if (this.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
            this.negative.active = false;
            this.positive.active = false;
            this.positive_single.active = true;
            this.btnclose.active = true;
        } else {
            this.negative.active = true;
            this.positive.active = true;
            this.positive_single.active = false;
            this.btnclose.active = false;
        }

        if (this.positiveName != "" && this.positiveName != undefined) {
            if (this.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                this.setPositiveSingleName(this.positiveName);
            } else {
                this.setPositiveButtonName(this.positiveName);
            }
        }

        if (this.negativeName != "" && this.negativeName != undefined) {
            this.setNegativeButtonName(this.negativeName);
        }

        this.addButtonListenner();

        // //var positiveText = cc.find("Image_10_0",this.positive);
        //
        // if(this.positiveBtResNormal){
        //     window.loadImg(this.positiveBtResNormal,function(spriteFrame){
        //         // var buttom = positiveText.getComponent(cc.Sprite) ;
        //         // buttom.spriteFrame = spriteFrame;
        //     });
        // }


        window.scaleTo(node);
    };

    this.addButtonListenner = function () {
        var self = this;
        if (this.negative.active) {
            this.negative.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,negative");
                if (self.btnTypeFlag != AlertViewBtnType.E_BTN_CLOSE) {

                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

                    if (self._callbackNegative) {
                        self._callbackNegative();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.btnclose.active) {
            this.btnclose.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,btnclose");
                if (self.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackNegative) {
                        self._callbackNegative();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.positive.active) {
            this.positive.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,positive");
                if (self.btnTypeFlag != AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackPositive) {
                        self._callbackPositive();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.positive_single.active) {

            this.positive_single.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,positive_single");
                if (self.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackPositive) {
                        self._callbackPositive();
                    }
                    self.dismiss();
                }
            });
        } else {
            this.positive_single.removeFromParent();
            //this.positive_single.getComponent(cc.Button).interactable = false;
        }
    }, this.setPositiveButton = function (callback, name) {
        //this._positiveFlag = true;
        this._callbackPositive = callback;
        this.positiveName = name;
    };

    this.setNegativeButton = function (callback, name) {
        //this._negativeFlag = true;
        this._callbackNegative = callback;
        this.negativeName = name;
    };

    this.setPositiveButtonName = function (name) {
        var lable = cc.find("label", this.positive);
        lable.getComponent(cc.Label).string = name;
    };

    this.setPositiveSingleName = function (name) {
        var lable = cc.find("label", this.positive_single);
        lable.getComponent(cc.Label).string = name;
    };

    this.setNegativeButtonName = function (name) {
        var lable = cc.find("label", this.negative);
        lable.getComponent(cc.Label).string = name;
    };

    this.removeFromParent = function () {
        this.dismiss();
    };
};

var AlertView = {

    create: function create() {
        return new AView();
    }

};

module.exports = AlertView;