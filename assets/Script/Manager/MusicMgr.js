var GameSystem = require("GameSystem");

var MusicMgr = {
    _audioVolume : 1.0,
    _musicVolume : 1.0,
    _isShake : true,
    _bgmid : -1 ,
    m_isAudioOn : true,
    m_isMusicOn : true,


    initAudio : function () {
        // init
        if ( cc.sys.localStorage.hasOwnProperty("SHAKE_OPEN")){
            this._isShake = cc.sys.localStorage.getItem("SHAKE_OPEN")
            this._isShake = this._isShake=="true"?true:false ;
            cc.log("MusicMgr.initAudio,this._isShake = " + this._isShake);
        }
        if(cc.sys.localStorage.hasOwnProperty("AUDIO_VOLUME")){
            this._audioVolume = cc.sys.localStorage.getItem("AUDIO_VOLUME");
            this._audioVolume = parseFloat(this._audioVolume);
            cc.log("MusicMgr.initAudio,this._audioVolume = " + this._audioVolume);
        }
        if(cc.sys.localStorage.hasOwnProperty("MUSIC_VOLUME")){
            this._musicVolume = cc.sys.localStorage.getItem("MUSIC_VOLUME");
            this._musicVolume = parseFloat(this._musicVolume);
            cc.log("MusicMgr.initAudio,this._musicVolume = " + this._musicVolume);
        }
        if(cc.sys.localStorage.hasOwnProperty("m_isAudioOn")){

            this.m_isAudioOn = cc.sys.localStorage.getItem("m_isAudioOn");
            this.m_isAudioOn = this.m_isAudioOn=="true"?true:false ;
            cc.log("MusicMgr.initAudio,this.m_isAudioOn = " + this.m_isAudioOn);

        }
        if(cc.sys.localStorage.hasOwnProperty("m_isMusicOn")){
            this.m_isMusicOn = cc.sys.localStorage.getItem("m_isMusicOn");
            this.m_isMusicOn = this.m_isMusicOn=="true"?true:false ;
            cc.log("MusicMgr.initAudio,this.m_isMusicOn = " + this.m_isMusicOn);
        }


    },

    /**
     *
     * @param path
     * @param onjs  是否挂在脚本上
     */
    playBackgroundMusic : function (path, onjs) {
        cc.log("MusicMgr.playBackgroundMusic,path = " + path);
        if(this.m_isMusicOn ){

            if(this._bgmid == -1){
                var audioID = -1 ;
                if(onjs){
                    audioID = cc.audioEngine.play( path, true ,this._musicVolume);
                }else{
                    var bgm = cc.url.raw(path);
                    audioID = cc.audioEngine.play( bgm, true ,this._musicVolume);
                }

                this._bgmid = audioID;
            }else{
                this.resumeBackgroundMusic() ;
            }
        }
    },

    stopEffect : function (audioID) {
        cc.audioEngine.stop(audioID);
    },

    // add by jackyu
    setVolumeQuite : function () {
        cc.audioEngine.setEffectsVolume(0.1);
    },
    
    
    stopBackgroundMusic : function( ){
        let state = cc.audioEngine.getState( this._bgmid)
        if( state != cc.audioEngine.AudioState.ERROR) {
            cc.audioEngine.stop(this._bgmid)
            this._bgmid  = -1
        }
    },

    pauseBackgroundMusic : function() {
        if( this._bgmid != -1){
            cc.audioEngine.pause( this._bgmid)
        }
    },

    resumeBackgroundMusic : function() {
    	
        if( this._bgmid != -1 && this.m_isMusicOn){
            cc.audioEngine.resume( this._bgmid)
        }
    },

    setMusicVolume : function( value) {
        this._musicVolume = value
        this.m_isMusicOn = this._musicVolume > 0;
        this._saveMusicValue();


        if( this._bgmid != -1){
            cc.audioEngine.setVolume( this._bgmid, this._musicVolume);
        }
    },

    getMusicVolume : function() {
        return this._musicVolume
    },

    _saveMusicValue : function() {
        cc.sys.localStorage.setItem("MUSIC_VOLUME", this._musicVolume);
        this.saveMusicON() ;
    },


    /**this
     *
     * @param path
     * @param loadOnjs  是否挂在 脚本上的资源
     */
    playEffect : function (path,loadOnjs)
    {
    	if(GameSystem.getInstance().VolumeState == 0)
        {
    		if(this.m_isAudioOn){
                if(loadOnjs){
                    cc.audioEngine.play(path,false ,this._audioVolume);
                }else{
                    var clip = cc.url.raw(path);
                    cc.audioEngine.play(clip,false ,this._audioVolume);
                }

            }
        }
    },


    setEffectsVolume : function( value) {
        this._audioVolume = value;
        this.m_isAudioOn = this._audioVolume>0;
        this._saveEffectValue();
    },


    getEffectVolume : function() {
        return this._audioVolume;
    },

    _saveEffectValue : function( ) {


        cc.sys.localStorage.setItem("AUDIO_VOLUME", this._audioVolume);
        this.saveAudioON() ;
    },

    playShake : function( ){
        cc.log( "震动还未实现！")
    },

    isShakeOn : function( ){
        return this._isShake
    },

    isShakeOpen : function( ){
        return this._isShake
    },
    setShakeOn : function( bEnable) {
        this._isShake = bEnable
        cc.sys.localStorage.setItem("SHAKE_OPEN", this._audioVolume);
    },

    preload : function( path) {
        cc.audioEngine.preload(path,function (){})
    },

    saveMusicON : function () {
        cc.sys.localStorage.setItem("m_isMusicOn", this.m_isMusicOn);
    },
    saveAudioON : function () {
        cc.sys.localStorage.setItem("m_isAudioOn", this.m_isAudioOn);
    },

};


module.exports = MusicMgr;