/**
 * Created by shrimp on 17/2/22.
 */
var Player = require('Player');

function GamePlayData()
{
    Player.apply([],this);

    this.clubid    = 0;   //我的俱乐部ID
    this.unionid   = "";
    this.openid    = "";
    this.superCost = 0;
    this.giftCost  = [];
    this.SelfClubId     = 0;  //我的俱乐部ID
    this.CurClubInfo    = null;
    this.CurClubMemList = null;

    
    this.Copy = function (player) {
        this.uid        = player.uid;
        this.name       = player.name;
        this.headurl    = player.headurl;
        this.sex        = player.sex;
        this.gold       = player.gold;    //身上金币
        this.diamond    = player.diamond; //身上钻石
        this.coin       = player.coin;    //携带金币
        this.seatid     = player.seatid;
        this.status     = player.status;
        this.winGold    = player.winGold;
        this.TotalCarry = player.TotalCarry;
        this.TotalRound = player.TotalRound;
        this.TotalTable = player.TotalTable;
        this.calltype   = player.calltype;
        this.bBanker    = player.bBanker;  //是否是庄家
        this.betcoinmul = player.betcoinmul;  //下注倍数
        this.bulltype   = player.bulltype;
        this.cards      = player.cards;
        this.finalcoin  = player.finalcoin;
        this.bOpenCard  = player.bOpenCard;
        this.roomcard   = player.roomcard;
    };
}

var GamePlayer = (function(){
    var instance ;

    function getInstance(){
        if( instance === undefined ){
            instance = new GamePlayData();
        }
        return instance;
    };

    return {
        getInstance : getInstance,
    }
})();

module.exports = GamePlayer;