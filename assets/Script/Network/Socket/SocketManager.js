/**
 * Created by shrimp on 17/2/19.
 */
var GameSystem  = require('GameSystem');
var SocketData  = require('SocketData') ;
var MessageFactory = require('MessageFactory');

function GameWebSocket(){
    this.m_socket = null;
    this.isSocketConnected = false;
    this.socketListenerID = -1;
    this.netConnected = true;
    this.onListenMessageToSend();
    this.onNetCheckListener();
}

//连接socket
GameWebSocket.prototype.startSocket = function(url)
{
    cc.log("SocketManager.startSocket,url = " + GameSystem.getInstance().webSocketUrl);
    this.isSocketConnected = false ;
    this.connectSocket(GameSystem.getInstance().webSocketUrl) ;
},

//重连服务器
GameWebSocket.prototype.reStartSocket = function(){
    cc.log("SocketManager.reStartSocket,url = " + GameSystem.getInstance().webSocketUrl);
    this.isSocketConnected = false ;
    this.connectSocket(GameSystem.getInstance().webSocketUrl) ;
},

//等待玩家发送数据
GameWebSocket.prototype.onListenMessageToSend = function(){
    cc.log("SocketManager.onListenMessageToSend");
    if (this.socketListenerID == -1){
        var self = this;

        this.socketListenerID = GlobalEventManager.getInstance().addEventListener(window.SOCKETT_SENDMESSAGE,
            function ( event) {
                cc.log("SocketManager.onListenMessageToSend event listener.");
                if(event){
                    self.sendMessage(event);
                }
            }, this);
    }
};

GameWebSocket.prototype.onNetCheckListener = function () {
    cc.log("SocketManager.onNetCheckListener" );
    var self = this ;

    GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo,
        function (event) {

            if(event){
                var tag = event.tag ;

                if(tag == window.GameInfo.NetOnline){
                    self.netConnected = true ;
                }
                else if(tag == window.GameInfo.NetOffline){
                    self.netConnected = false ;
                }
            }

        },this);
}


//建立链接
GameWebSocket.prototype.connectSocket = function(url){
    cc.log("SocketManager.connectSocket, url = " + url );
    var self = this;

    GameSystem.getInstance().aesKey = AES.utils.utf8.toBytes(GameSystem.getInstance().defaultKey);
    this.m_socket = new WebSocket(url) ;
    this.m_socket.binaryType = "arraybuffer";

    //建立链接
    this.m_socket.onopen = function(event){
        self.isSocketConnected = true ;
        cc.log("SocketManager.connectSocket,socket connected");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,{tag:window.MessageType.SOCKET_CONNECTED,}) ;

    };

    //失败 断开链接
    this.m_socket.onerror = function(event){
        self.isSocketConnected = false ;
        cc.warn("SocketManager.connectSocket,socket error");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,{tag:window.MessageType.MSG_NETWORK_FAILURE,}) ;

    };

    //链接断开
    this.m_socket.onclose = function(event) {
        self.isSocketConnected = false ;
        cc.warn("SocketManager.connectSocket,socket disconnect");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,{tag:window.MessageType.SOCKET_DISCONNECTED,}) ;

    };

    //接收服务器到消息
    this.m_socket.onmessage = function(event){

        var decStr = AesDecode(event.data);
        cc.log("SocketManager.connectSocket ,socket rec message, data = ",decStr);
        var packet = JSON.parse(decStr);

        var cmd = packet.cmd;

        var message = MessageFactory.createMessageResp(cmd);

        if(message == undefined){
            cc.warn("SocketManager.connectSocket , message = undefined");
            return ;
        }
        //解析数据
        message.onMessage(packet);
        // //通知 有新消息到
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,{tag:window.MessageType.SOCKET_MESSAGE,data:message}) ;
    };
};

//关闭链接
GameWebSocket.prototype.disconnect = function(){
    cc.log("SocketManager.connectSocket ");
    //检测是有连接
    if(this.m_socket && this.isConnected() && this.netConnected){
        this.m_socket.close() ;
        this.m_socket = null ;
        this.isSocketConnected = false ;
    }
};


//发送消息
GameWebSocket.prototype.sendMessage = function(data){
    cc.log("SocketManager.sendMessage ");
    if(!this.netConnected){
        // ToastView.show("请检查网络") ;
        cc.warn("ocketManager.sendMessage,网络尚未连接 socket发送失败");
        return ;
    }

    if(!this.isSocketConnected ){
        cc.warn("ocketManager.sendMessage,socket 尚未连接上");
        //ToastView.show("服务器连接失败") ;
        return ;
    }

    if(this.m_socket == null){
        cc.warn("ocketManager.sendMessage,没有创建socket");
        return ;
    }

    if (this.m_socket.readyState === WebSocket.OPEN)
    {
        cc.log("SocketManager.sendMessage,cmd == 0x0%s", data.data.cmd.toString(16));
        var str = JSON.stringify(data.data);
        cc.log("SocketManager.sendMessage,str = %s", str.toString());
        var enc = AesEncode(str)
         this.m_socket.send(enc);
    }
    else
    {
        //ToastView.show("服务器连接失败") ;
        cc.warn("ocketManager.sendMessage,socket 状态关闭");
    }
};

function AesEncode(str) {
    var textBytes = AES.utils.utf8.toBytes(str);
    var aesOfb = new AES.ModeOfOperation.ofb(GameSystem.getInstance().aesKey, GameSystem.getInstance().iv);
    var encryptedBytes = aesOfb.encrypt(textBytes);
    return encryptedBytes;
}

function AesDecode(data) {
    // cc.log("AesDecode,aesKey = " + Array.from(GameSystem.getInstance().aesKey) + ",iv = " + GameSystem.getInstance().iv);
    var aesOfb = new AES.ModeOfOperation.ofb(GameSystem.getInstance().aesKey, GameSystem.getInstance().iv);
    // cc.log("AesDecode,data = " + data);
    // cc.log("AesDecode,bufferLength = " + data.byteLength);
    var text = new Uint8Array(data, 0, data.byteLength);
    // cc.log("AesDecode,text = " + text);
    var desc = aesOfb.decrypt(text);
    // cc.log("AesDecode,desc = " + desc);
    var str  = AES.utils.utf8.fromBytes(desc);
    // cc.log("AesDecode,str = " + str);
    return str;
}


//是否连接
GameWebSocket.prototype.isConnected = function(){
    return this.isSocketConnected ;
};


GameWebSocket.prototype.base64String = function (data) {
    return BASE64.encoder(data);
};

var SocketManager = (function(){
    var instance ;
    function getInstance(){
        if(instance === undefined){
            instance = new GameWebSocket();
        }
        return instance ;
    }

    return{
        getInstance : getInstance,
    };
})();

module.exports = SocketManager;