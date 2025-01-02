'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
cc.Class({
    extends: cc.Component,

    properties: {
        CardType: 0,
        CurMult: 1,
        CurPos: 0,
        FontName: cc.Label,
        Number: cc.Label,
        BtnAdd: cc.Button,
        BtnSub: cc.Button,
        BtnSpriteFrame: [cc.SpriteFrame], // 0 : 按钮用白色背景 ， 1: 按钮用黄色背景
        bClubCreate: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initData();
    },

    // E_BULL_ZERO       = 0 //没牛
    // E_BULL_ONE        = 1 //牛1
    // E_BULL_TWO        = 2
    // E_BULL_THREE      = 3
    // E_BULL_FOUR       = 4
    // E_BULL_FIVE       = 5
    // E_BULL_SIX        = 6
    // E_BULL_SEVEN      = 7
    // E_BULL_EIGHT      = 8
    // E_BULL_NINE       = 9
    // E_BULL_PAIR       = 10 //牛对子
    // E_BULL_BULL       = 11 //牛牛
    // E_BULL_LINE       = 12 //牛顺子
    // E_BULL_THREE_TWO  = 13 //三带二
    // E_BULL_BOMB       = 14 //炸弹
    // E_BULL_SMALL_FIVE = 15 //五小牛
    // E_BULL_FIVE_KING  = 16 //五花牛
    // E_BULL_MAX        = 17
    initData: function initData() {
        this.CardTypeMult = [[1], [1], [1], [1], [1], [1], [1], //0~6
        [1, 2], //7
        [2, 3], //8
        [2, 3], //9
        [0], //牛对子
        [3, 4, 5], //牛牛
        [0, 4, 5, 6, 7, 8], //牛顺子
        [0, 4, 5, 6, 7, 8], //三带二
        [0, 4, 5, 6, 7, 8], //炸弹
        [0, 4, 5, 6, 7, 8], //五花牛
        [0, 4, 5, 6, 7, 8]];

        this.length = this.CardTypeMult[this.CardType].length;
        this.CurMult = this.CardTypeMult[this.CardType][0];
        this.setNumber(this.CurMult);
        this.setFontName(window.Bullfight_CardTypeName[this.CardType]);
        this.setBtnBgFrame();
    },

    getCurMult: function getCurMult() {
        return this.CurMult;
    },

    setCardType: function setCardType(cardtype) {
        this.CardType = cardtype;
        this.initData();
    },

    setFontName: function setFontName(name) {
        cc.log("Bullfight_MultCell.setFontName,name = " + name);
        this.FontName.string = name;
    },

    setNumber: function setNumber(number) {
        cc.log("Bullfight_MultCell.setNumber,number = " + number);
        this.Number.string = number;
        this.setBtnBgFrameByCurMult();
    },

    setClubCreate: function setClubCreate(bClubCreate) {
        this.bClubCreate = bClubCreate;
        cc.log("Bullfight_MultCell.setClubCreate,bClubCreate = " + bClubCreate);
        if (this.bClubCreate == false) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnSub.interactable = false;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnAdd.interactable = false;
        }
        // else
        // {
        //     this.setBtnBgFrameByCurMult();
        // }
    },

    setBtnBgFrame: function setBtnBgFrame() {
        if (this.CardType >= window.Bullfight_CardType.E_BULL_SEVEN) {
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        } else {
            this.BtnAdd.interactable = false;
            this.BtnSub.interactable = false;
        }

        this.setBtnBgFrameByCurMult();
    },

    setBtnBgFrameByCurMult: function setBtnBgFrameByCurMult() {
        cc.log("Bullfight_MultCell.setBtnBgFrameByCurMult,this.CurMult = " + this.CurMult);
        if (this.length <= 1) return;

        if (this.bClubCreate == false) {
            var mult = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 3, 4, 4, 5, 5, 5];
            this.CurMult = mult[this.CardType];
            this.Number.string = mult[this.CardType];
            this.setClubCreate(this.bClubCreate);
        } else if (this.CurMult > this.CardTypeMult[this.CardType][0] && this.CurMult < this.CardTypeMult[this.CardType][this.length - 1]) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnAdd.interactable = true;
        } else if (this.CurMult <= this.CardTypeMult[this.CardType][0]) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnSub.interactable = false;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnAdd.interactable = true;
        } else {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnAdd.interactable = false;
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_Menu.callBackBtn,btnName = " + btnName);
        if (btnName == "Btn_Add") {
            this.CurPos++;
            if (this.CurPos >= this.length) {
                this.CurPos = this.length - 1;
            }
            this.CurMult = this.CardTypeMult[this.CardType][this.CurPos];
            this.setNumber(this.CurMult);
        } else if (btnName == "Btn_Sub") {
            this.CurPos--;
            if (this.CurPos < 0) {
                this.CurPos = 0;
            }
            this.CurMult = this.CardTypeMult[this.CardType][this.CurPos];
            this.setNumber(this.CurMult);
        }
    }
});