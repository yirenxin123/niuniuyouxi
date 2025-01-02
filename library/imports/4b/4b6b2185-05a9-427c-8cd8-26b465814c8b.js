'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: cc.Component,

    properties: {
        CardValue: [cc.Label]
    },

    onLoad: function onLoad() {
        cc.log("Bullfight_CustomCardType.OnLoad");
    },

    initData: function initData() {
        cc.log("Bullfight_CustomCardType.initData.");
        this.m_iCardValue = new Array();
    },

    callBackBtnCard: function callBackBtnCard(event, CustonEventData) {
        if (this.node.active == false) {
            cc.log("Bullfight_CustomCardType.callBackBtnCard this.node.active=", this.node.active);
            return;
        }

        var card = event.target.getComponent("Poker");
        if (this.m_iCardValue.length >= 3 && card.cardSelected == 0) {
            cc.log("Bullfight_CustomCardType.callBackBtnCard length=", this.m_iCardValue.length, " cardSelected=", card.cardSelected);
            return;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        card.setBtnCard();

        cc.log("Bullfight_CustomCardType.callBackBtnCard,value = " + card.cardValue);

        var value = card.cardValue > 10 ? 10 : card.cardValue;
        if (card.cardSelected == 1) {
            this.m_iCardValue.push(value);
        } else {
            this.removeByValue(value);
        }
        this.updataCustomCardType();
        this.logAllCardValue();
    },

    removeByValue: function removeByValue(value) {
        for (var index = 0; index < this.m_iCardValue.length; index++) {
            if (this.m_iCardValue[index] == value) {
                this.m_iCardValue.splice(index, 1);
                break;
            }
        }
    },

    clearCustomCardType: function clearCustomCardType() {
        this.CardValue[0].string = "";
        this.CardValue[1].string = "";
        this.CardValue[2].string = "";
        this.CardValue[3].string = "";
    },

    updataCustomCardType: function updataCustomCardType() {
        this.CardValue[0].string = "";
        this.CardValue[1].string = "";
        this.CardValue[2].string = "";
        this.CardValue[3].string = "";

        var value = 0;
        for (var index = 0; index < this.m_iCardValue.length && index < 3; index++) {
            value += this.m_iCardValue[index];
            if (index == 3) {
                this.CardValue[index].string = value;
            } else {
                this.CardValue[index].string = this.m_iCardValue[index];
            }
        }
        this.CardValue[3].string = value;
    },

    logAllCardValue: function logAllCardValue() {
        for (var index = 0; index < this.m_iCardValue.length; index++) {
            cc.log("logAllCardValue.value = " + this.m_iCardValue[index]);
        }
    }
});