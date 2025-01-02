window.GiftType = cc.Enum({
    E_ROSE_GIFT     : 1, //玫瑰
    E_LOVE_GIFT     : 2, //爱心
    E_FOAM_GIFT     : 3, //泡沫
    E_BIG_ROSE_GIFT : 4, //大朵玫瑰
    E_KETCHUP_GIFT  : 5, //番茄酱
});

cc.Class({
    extends: cc.Component,

    properties: {
        // ...
        GiftIcon   : [cc.SpriteFrame],
        GiftFrame1 : [cc.SpriteFrame],
        GiftFrame2 : [cc.SpriteFrame],
        GiftFrame3 : [cc.SpriteFrame],
        GiftFrame4 : [cc.SpriteFrame],
        GiftFrame5 : [cc.SpriteFrame],
        FaceFrame1 : [cc.SpriteFrame],
        FaceFrame2 : [cc.SpriteFrame],
        FaceFrame3 : [cc.SpriteFrame],
        FaceFrame4 : [cc.SpriteFrame],
        FaceFrame5 : [cc.SpriteFrame],
        FaceFrame6 : [cc.SpriteFrame],
        FaceFrame7 : [cc.SpriteFrame],
        FaceFrame8 : [cc.SpriteFrame],
        FaceFrame9 : [cc.SpriteFrame],
        FaceFrame10 : [cc.SpriteFrame],
        FaceFrame11 : [cc.SpriteFrame],
        FaceFrame12 : [cc.SpriteFrame],
        WinFrame : [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {

    },
    
    playWinAnimation : function (pos) {
        var node = new cc.Node();
        node.setPosition(pos);
        node.y += 200;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.WinFrame[0];
        //node.position = cc.p(540,960);
        this.node.addChild(node);
        var animation = node.addComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(this.WinFrame, this.WinFrame.length);
        animation.playTimes = -1;
        animation.addClip(clip,"anim");
        animation.play("anim");

        node.runAction(cc.sequence(cc.delayTime(1.5),cc.removeSelf(true)).speed(0.4));
    },
    
    playFaceAnimation : function (type,pos) {
        var animationFrames = [];
        if(type == 1)
        {
            animationFrames = this.FaceFrame1;
        }
        else if(type == 2)
        {
            animationFrames = this.FaceFrame2;
        }
        else if(type == 3)
        {
            animationFrames = this.FaceFrame3;
        }
        else if(type == 4)
        {
            animationFrames = this.FaceFrame4;
        }
        else if(type == 5)
        {
            animationFrames = this.FaceFrame5;
        }
        else if(type == 6)
        {
            animationFrames = this.FaceFrame6;
        }
        else if(type == 7)
        {
            animationFrames = this.FaceFrame7;
        }
        else if(type == 8)
        {
            animationFrames = this.FaceFrame8;
        }
        else if(type == 9)
        {
            animationFrames = this.FaceFrame9;
        }
        else if(type == 10)
        {
            animationFrames = this.FaceFrame10;
        }
        else if(type == 11)
        {
            animationFrames = this.FaceFrame11;
        }
        else if(type == 12)
        {
            animationFrames = this.FaceFrame12;
        }
        this.playAnimationByType(animationFrames,pos);
    },

    playGiftAnimation : function (giftType,start,end)
    {
        var animationFrames = [];
        if(giftType == 1)
        {
            animationFrames = this.GiftFrame1;
        }
        else if(giftType == 2)
        {
            animationFrames = this.GiftFrame2;
        }
        else if(giftType == 3)
        {
            animationFrames = this.GiftFrame3;
        }
        else if(giftType == 4)
        {
            animationFrames = this.GiftFrame4;
        }
        else if(giftType == 5)
        {
            animationFrames = this.GiftFrame5;
        }
        this.playGiftAnimationByType(animationFrames, start, end);
    },


    playAnimationByType : function (Frames,pos)
    {
        var node = new cc.Node();
        node.setPosition(pos);
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = Frames[0];
        this.node.addChild(node);
        var animation = node.addComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(Frames, Frames.length);
        animation.addClip(clip,"anim");
        animation.play("anim");

        node.runAction(cc.sequence(cc.delayTime(Frames.length*0.2),cc.removeSelf(true)).speed(0.4));
    },

    playGiftAnimationByType : function (Frames,start,end)
    {
        var node = new cc.Node();
        node.setPosition(start);
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = Frames[0];
        this.node.addChild(node);


        var finished = cc.callFunc(function(node, Frames) {
            var animation = node.addComponent(cc.Animation);
            var clip = cc.AnimationClip.createWithSpriteFrames(Frames, Frames.length);
            animation.addClip(clip, "anim");
            animation.play("anim");
            node.runAction(cc.sequence(cc.delayTime(Frames.length*0.4), cc.removeSelf(true)));
        }, node, Frames);

        node.runAction(cc.sequence(cc.moveTo(0.5, end), finished).speed(0.4));
    },
});
