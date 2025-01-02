/**
 * Created by shrimp on 17/2/19.
 */

/**
 * 模拟 C++ 工程架构
 *
 * 使用的XMLHttpRequest  需要解决跨域问题
 * 服务器加上head
 *
 * jQuery 网页可以  但是不能上手机
 *
 */
var GameSystem = require('GameSystem');

function HttpMessage ()
{
    this.isSucceed = false;
    this.tag = "";
    this.data = null;
    this.code = -1;
    this.error = "";
    this.flag = -1 ;
}

function HttpMessageGetDoman()
{
    HttpMessage.apply(this,[]);  //集成父类数据
    this.strUcenterUrl;
}

function HttpMessageGetWlanIP()
{
    HttpMessage.apply(this,[]);  //集成父类数据
}

function ImageHolder(){

    this.img = null;
    this.tag = "";
}

function HttpRequest(tag ,data,url,type,callback){
    cc.log("HttpManager.HttpRequest,url = " + url);
    this.tag = tag;
    this.url = url;
    this.callBack = callback;

    var self = this ;

    this.sendRequest = function(){
        var self = this ;
        var xhr = new XMLHttpRequest() ;
        var url = this.url ;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 ) {
                if((xhr.status >= 200 && xhr.status < 400)){
                    var response = xhr.responseText ;
                    if(self.callBack){
                        self.callBack(this,response);
                    }else{
                        self.success_jsonpCallback(JSON.parse(response)) ;
                    }

                }else{
                    var response = xhr.responseText ;
                    cc.log("HttpManager.sendRequest,xhr.status = %d,response = %s",xhr.status,response);
                    var message = new HttpMessage() ;
                    message.data = null;
                    message.isSucceed = false ;

                    GlobalEventManager.getInstance().emitEvent(window.HttpMessage,{tag:window.HttpMessageType.HTTP_NOTIFICATION,msg:message});
                }
            }
            cc.log("HttpManager.sendRequest,xhr.readyState = %d",xhr.readyState);
        };

        xhr.open(type, url + tag, true);
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
        xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        var result  = xhr.send(data) ;
        cc.log("HttpManager.sendRequest,result = " + result);
    };
    
    this.fail_jsonpCallback = function () {
        
    },

    //成功回调
    this.success_jsonpCallback = function(data)
    {
        var message = new HttpMessage() ;
        message.tag = tag ;
        message.code = data.code;
        if(data.code == window.HttpCode.HTTP_SUCCESS)
        {
            message.data = data;
            message.isSucceed = true ;
            cc.log("http 请求成功 : %s = %s",tag,JSON.stringify(data));
        }
        else
        {
            message.data = data;
            message.isSucceed = false ;
            cc.warn("http 请求返回异常 非success flag : %s = %s",tag,JSON.stringify(data) );
        }

        GlobalEventManager.getInstance().emitEvent(window.HttpMessage,{tag:window.HttpMessageType.HTTP_NOTIFICATION,msg:message});
    }
}

function HttpControl(callback){
    this.callBack = callback;
}

//发送普通消息
HttpControl.prototype.sendCommonRequest = function(tag, data, url){
    if(url === undefined){
        url =  GameSystem.getInstance().weburl + "/";
    }

    var sendData = JSON.stringify(data);//encodeURI(JSON.stringify(test));
    new HttpRequest(tag, sendData, url, "post").sendRequest();
    cc.log("发送http请求 = %s  : %s : %s", tag, JSON.stringify(data),sendData);
}

HttpControl.prototype.sendCommonRequestGet = function(tag, data, url){
    if(url === undefined){
        url =  GameSystem.getInstance().weburl + "/";
    }

    var sendData = JSON.stringify(data);//encodeURI(JSON.stringify(test));
    new HttpRequest(tag, sendData, url, "get").sendRequest();
    cc.log("发送http请求 = %s  : %s : %s", tag, JSON.stringify(data),sendData);
}

//数据加密
HttpControl.prototype.base64EncodeData = function (data) {
    let encodedData = BASE64.encoder(data);

    let md5str  = hex_md5(encodedData);

    let encodedData2 = BASE64.encoder(encodedData + md5str);
    return encodedData2;
}


HttpControl.prototype.base64DecodeData = function (data) {
    let encodedData = BASE64.decoder(data);

    if(encodedData.length > 32)
    {
        encodedData = encodedData.substr(0, encodedData.length - 32);
        let encodedData2 = BASE64.decoder(encodedData);
        return encodedData2;
    }
    return "";
}

HttpControl.prototype.sendUploadImg = function (tag,url,data) {
    if(url = undefined)
    {
        url = "http://manage.aqddp.cn/Home/Picupload/upload";
    }
    //var sendData = JSON.stringify(data);//encodeURI(JSON.stringify(test));
    new HttpRequest(tag, data, url, "post").sendRequest();
    cc.log("发送http请求 = %s  : %s ", tag, data);
}

/**
 * 创建HttpManager接口
 * @method getInstance
 */
var HttpManager = (function(){
    var instance ;
    function getInstance(){
        if( instance === undefined ){
            instance = new HttpControl();
        }
        return instance;
    };

    return {
        getInstance : getInstance,
    }
})();

module.exports = HttpManager;



