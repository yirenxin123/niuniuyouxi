var ToastView = require("ToastView");
var LoadingView = require('LoadingView');


var LoadingView = {};

LoadingView.curView = null ;
LoadingView.tipText = null ;
LoadingView.timeoutTag = 0;//超时回调句柄

//预防未加载完成 调用关闭
LoadingView.callClose = false ;
LoadingView.callLoadPrefabs = false ;
LoadingView.m_tips = "" ;
LoadingView.m_allowCLose = false ;


LoadingView.show = function (tips,parent, allowClose) {
    cc.log("LoadingView.show,tips = " + tips);
    if(tips == "")
    {
        return;
    }
    this.dismiss();
    var self = this ;
    this.m_tips = tips;
    this.m_allowCLose = allowClose === undefined ? false : allowClose ;

    if(!self.callLoadPrefabs){
        this.callLoadPrefabs = true ;
        window.loadPrefabs("prefabs/LoadingView/LoadingView", function (newNode) {
            self.callLoadPrefabs = false ;
            self.curView = newNode ;
            if(self.callClose){
                self.dismiss() ;
            }else{
                cc.log("LoadingView.show,111");
                self.updateView(newNode,self.m_tips,parent ,self.m_allowCLose);
            }
        },parent);
    }else{
        self.callClose = false ;
    }
}

LoadingView.updateView = function (node, tips,parent ,allowClose) {

    cc.log("LoadingView.updateView");
    node.on(cc.Node.EventType.TOUCH_START,function (event) {
        event.stopPropagation() ;
    });

    this.tipText = cc.find("Bg/LabelText",node).getComponent(cc.Label) ;
    if(tips){
        this.setText(tips);
    }

    // var clodeBt = cc.find("close",node);
    //
    // var self = this ;
    // clodeBt.on(cc.Node.EventType.TOUCH_START,function () {
    //     self.dismiss() ;
    // });

    //屏蔽关闭 YUNG ADD
    var showClose = false;//allowClose === undefined? true : false ;

    //clodeBt.active = showClose;
    //
    // var aniLoading = cc.find("ani",node).getComponent(cc.Animation) ;
    //
    // var animState = aniLoading.play("loadingani");
    // animState.wrapeMode = cc.WrapMode.Loop;
    // animState.repeatCount = Infinity;
}

LoadingView.setTimeOut = function (time) {
    cc.log("LoadingView.setTimeOut,time = " + time);
    if(time && time >0){
        var self = this ;
        this.timeoutTag = window.setTimeout("require('LoadingView').onTimeOut()",time*1000);
        // this.scheduleOnce(function () {//component组件使用
        //     self.onTimeOut();
        // },time) ;
    }
}

LoadingView.onTimeOut = function () {
    cc.log("LoadingView.onTimeOut");
    // this.unschedule(this.onTimeOut);
    ToastView.show("网络请求超时");
    this.dismiss();
} ,

LoadingView.setText = function (tips) {
    cc.log("LoadingView.setText,tips = " + tips);
    if(this.tipText){
        this.tipText.string = tips ;
    }else{
        this.show(tips) ;
    }
},

LoadingView.dismiss = function () {
    cc.log("LoadingView.dismiss");
    if(this.timeoutTag)
        window.clearTimeout(this.timeoutTag);
    
    if(this.curView){
        this.curView.removeFromParent(true) ;
        this.curView = null ;
        this.tipText = null ;
        this.callClose = false ;
        this.callLoadPrefabs = false ;
        this.m_tips  = "" ;
        this.m_allowCLose = false ;
    }else {
        // if( this.callLoadPrefabs){
        //     this.callClose = true ;
        // }
    }
}


module.exports = LoadingView ;