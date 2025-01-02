var UtilTool = require('UtilTool');

cc.Class({
    extends: cc.Component,

    properties: {
        Head : cc.Sprite,
        Name : cc.Label,
        RoleSprite : cc.Sprite,
        RoleFrame  : [cc.SpriteFrame],
        Time : cc.Label,
        BtnSet : cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.info = null;
    },
    
    // Uid      uint32 `json:"uid"`
    // Name     string `json:"name"`
    // HeadUrl  string `json:"headurl"`
    // Sex      int    `json:"sex"`
    // Role     uint8  `json:"role"`
    // LastTime int64  `json:"lasttime"`

    setPersonInfo : function (info) {
        cc.log("ClubPersonCell name=", info.name, " headurl=", info.headurl, " role=", info.role, " time=", info.lasttime);
        this.info = info;
        this.Name.string = info.name;
        this.Time.string = UtilTool.getFormatData(info.lasttime);
        UpdateWXHeadIcon(info.headurl, this.Head);

        if (info.role == window.ClubRole.E_CLUB_OWNER_ROLE) {
            this.RoleSprite.spriteFrame = this.RoleFrame[0];
        } else if (info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
            this.RoleSprite.spriteFrame = this.RoleFrame[1];
        } else {
            cc.log("ClubPersonCell.setPersonInfo role = normal");
            this.RoleSprite.node.active = false;
        }
    },

});
