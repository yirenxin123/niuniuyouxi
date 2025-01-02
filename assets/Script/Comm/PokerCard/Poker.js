var CARD_UP_POS = 20;
var CARD_COLOR_MARK = 0xf0;
var CARD_VALUE_MARK = 0x0f;

var cardEnum = [
    0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d, //♠️
    0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1a,0x1b,0x1c,0x1d, //♥️
    0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2a,0x2b,0x2c,0x2d, //️♣️
    0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,0x3c,0x3d, //♦
    ]; //大小王

cc.Class({
    extends: cc.Component,

    properties: {
        cardData : 0,
        cardColor : 0,
        cardValue : 0,
        cardSelected : 0,
        CardBgImg : cc.Sprite,
        ValueImg : cc.Sprite,
        ColorImg : cc.Sprite,
        SmallColorImg : cc.Sprite,
        GrayLayer : cc.Sprite,
        CardGroundImg : cc.Sprite,

        ValueBlackFrame : [cc.SpriteFrame],
        ValueRedFrame : [cc.SpriteFrame],
        ColorFrame : [cc.SpriteFrame],
        SmallFrame : [cc.SpriteFrame],
        CardGround : cc.SpriteFrame,
        CardBg : cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
    },

    initCard : function(cardData){
        cc.log('Poker : initCard,cardData = ' + cardData);
        this.cardData = cardData;
        this.cardColor = this.getCardColorFromData(cardData);
        this.cardValue = this.getCardValueFromData(cardData);
        this.CardGroundImg.node.active = false;
        cc.log("Poker : initCard,cardValue = " + this.cardValue);
        if (cardData == 0)
        {
            //牌背
            for (var index = 0;index < this.CardBgImg.node.childrenCount;index++)
            {
                this.CardBgImg.node.children[index].active = false;
            }
            this.CardBgImg.spriteFrame = this.CardGround;
        }
        else
        {
            this.CardBgImg.node.active = true;
            this.ColorImg.node.active = true;
            this.ValueImg.node.active = true;
            this.SmallColorImg.node.active = true;
            this.GrayLayer.node.active = false;
            this.CardBgImg.spriteFrame = this.CardBg;
            //牌面
            if(this.cardColor == 0 || this.cardColor == 2)
            {
                this.ColorImg.spriteFrame = this.ColorFrame[this.cardColor];
                this.SmallColorImg.spriteFrame = this.SmallFrame[this.cardColor];
                this.ValueImg.spriteFrame = this.ValueBlackFrame[this.cardValue - 1];
            }
            else if(this.cardColor == 1 || this.cardColor == 3)
            {
                this.ColorImg.spriteFrame = this.ColorFrame[this.cardColor];
                this.SmallColorImg.spriteFrame = this.SmallFrame[this.cardColor];
                this.ValueImg.spriteFrame = this.ValueRedFrame[this.cardValue - 1];
            }
            else if(this.cardColor === 4)
            {
                //大小王
                cc.error('Poker : initCard,cardColor error');
            }
            else{
                cc.error('Poker : initCard,cardColor error');
            }
        }

        cc.log("Poker : initCard,CardGroundImg.active = " + this.CardGroundImg.node.active);
    },

    getValueStringFromData : function () {

    },
    
    getCardColorFromData : function(CardDate)
    {
        return (CardDate & CARD_COLOR_MARK)>>4;
    },
    
    getCardValueFromData : function(CardDate)
    {
        return (CardDate & CARD_VALUE_MARK);
    },
    
    runCardSelect : function(Select)
    {
        cc.log('Poker : runCardSelect,bSelect = ',Select);

        this.cardSelected = Select;
        if (this.cardSelected == 1)
        {
            this.node.position = cc.p(this.node.getPosition().x, CARD_UP_POS);
        }
        else
        {
            this.node.position = cc.p(this.node.getPosition().x,0);
        }
    },

    setCardSelecting : function(bSelect)
    {
        cc.log('Poker.setCardSelecting,bSelect = ' + bSelect);
        this.cardSelected = bSelect;
        if(bSelect == 1)
        {
            this.GrayLayer.node.opacity = 180;
        }
        else
        {
            this.GrayLayer.node.opacity = 0;
        }
    },
    
    setBtnCard : function () {
        this.cardSelected = (this.cardSelected == 0 ? 1 : 0);
        this.runCardSelect(this.cardSelected);
    },

});
