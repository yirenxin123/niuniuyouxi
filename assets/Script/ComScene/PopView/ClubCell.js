var GamePlayer = require('GamePlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        ClubAddress : cc.Label,
        ClubIcon : cc.Sprite,
        ClubName : cc.Label,
        ClubPresons : cc.Label,
        ClubAddress2 : cc.Label,
        ClubIntro : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.info = null;
    },

    setClubCellInfo : function (info) {
        //{"clubid":10000019,"role":1,"owneruid":10688,"level":1,"name":"as",
        // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
        // "members":1,"maxmember":10}
        if (GamePlayer.getInstance().uid == info.owneruid) {
            GamePlayer.getInstance().SelfClubId = info.clubid;
        }

        cc.log("ClubCell.setClubCellInfo clubid=", info.clubid, " owneruid=", info.owneruid);

        this.info                = info;
        this.ClubAddress.string  = info.address;
        this.ClubAddress2.string = info.address;
        this.ClubName.string     = info.name;
        this.ClubPresons.string  = info.members + "/" + info.maxmember;
    },
    
    callBackBtn : function (event , CustomEventData) {
        cc.log("ClubCell.callBackBtn");
    },
});
