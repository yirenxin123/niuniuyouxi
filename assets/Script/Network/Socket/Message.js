/**
 * Created by shrimp on 17/2/19.
 */
var GamePlayer = require('GamePlayer');

function Message()
{
    this.cmd = 0;
    this.seq = 0;
    this.uid = GamePlayer.getInstance().uid;

    this.data = "" ;

    this.onMessage = function(data)
    {
    };
    this.send = function()
    {
    };
    this.proccess = function(ui)
    {
    };
}

module.exports = Message;