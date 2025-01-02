/**
 * Created by shrimp on 17/2/19.
 */

var m_EncryptMap=
    [
        0x51,0xA1,0x9E,0xD7,0x1E,0x83,0x1C,0x2D,0xE9,0x77,0x3D,0x13,0x93,0x10,0x45,0xFF,
        0x6D,0xC9,0x20,0x2F,0x1B,0x82,0x1A,0x7D,0xF5,0xCF,0x52,0xA8,0xD2,0xA4,0xB4,0x0B,
        0x31,0x97,0x57,0x19,0x34,0xDF,0x5B,0x41,0x58,0x49,0xAA,0x5F,0x0A,0xEF,0x88,0x01,
        0xDC,0x95,0xD4,0xAF,0x7B,0xE3,0x11,0x8E,0x9D,0x16,0x61,0x8C,0x84,0x3C,0x1F,0x5A
    ];

function getutf8bytecount(byteval)
{
    var bCount = 0;
    for (var i = 7; i >= 0; --i)
    {
        if (byteval & (1 << i)) {
            bCount++;
        } else {
            break;
        }
    }
    return bCount;
}

function utf8tounicode(code)
{
    if (code <= 0x7f) {
        return String.fromCharCode(code)
    }
    var bStart = false;
    var bCount = 0;
    var bFinish = false;
    var newCode = 0;
    var bFlag = code & 0xff;
    bCount = getutf8bytecount(bFlag);
    var newCode = 0;
    for (var i = 0; i < bCount; ++i) {
        var val = code & (0xff << (i * 8))

        val = val >>> (i * 8)
        if (i == 0) {
            for (var t = 1; t <= bCount; ++t) {
                val = val & (~(1 << (8 - t)));
            }
        } else {
            val = val & 0x3f;
        }
        newCode += val << (6 * (bCount - i - 1));
    }
    return String.fromCharCode(newCode)
}

function unicodetoutf8(code)
{
    if (code <= 0x7f) { // 不需要转换
        return {code:code, bytelen:1};;
    }

    var bCount = 0; // 二进制位数量
    for (var i = 0; i < 32; ++i) {
        if (code & (1 << i)) {
            bCount = i + 1;
        }
    }
    var bByte = 0;
    // utf8编码占用的字节数
    bByte = Math.ceil(bCount / 6);

    // 计算是否要进位
    var bTmp = bCount % 6;
    bTmp = (bTmp == 0) ? 6 : bTmp;

    if (bTmp > (7 - bByte)) {
        bByte++;
    }
    // 填充编码
    var utf8Code = 0;
    for (var i = 0; i < bByte - 1; ++i)
    {
        var bValue = (code >>> (i * 6)) & 0x3f; // 最低位放到最高位
        bValue = (1 << 7) + bValue;

        utf8Code += bValue << ((bByte - i - 1) * 8);
    }

    // 填充最后剩余的编码
    var bValue = code >>> ((bByte - 1) * 6);

    // 填充标识符
    var bFlag = 0;
    for (var i = 0; i < bByte; ++i) {
        bFlag += 1 << (7 - i);
    }

    utf8Code += bFlag + bValue;

    return {code:utf8Code, bytelen:bByte};
}

function utfbytes2string(bytes)
{
    if (bytes.length == 0) {
        return "";
    }
    var retString = "";
    for (var i = 0; i < bytes.length; )
    {
        if (bytes[i] <= 0x7f) {
            retString += utf8tounicode(bytes[i]);
            i++;
            continue;
        }
        var bCount = getutf8bytecount(bytes[i]);
        var utf8code = 0;
        for (var t = 0; t < bCount; ++t) {
            utf8code += bytes[i + t] << (t * 8)
        }
        retString += utf8tounicode(utf8code);
        i += bCount;
    }
    return retString;
}

String.prototype.toUtf8 = function() {
    var strLen = this.length;
    var allBytes = [];
    var allLen = 0;
    for (var i = 0; i < strLen; ++i) {
        var unicode = this.charCodeAt(i);
        var result = unicodetoutf8(unicode);
        allLen += result.bytelen;
        allBytes.push(result);
    }
    return {codes: allBytes, bytelens: allLen};
};


//htl，大小端  offset 指定位置
function item(type, len, value,htl,offset)
{
    var obj = new Object();
    obj.type = type;
    obj.len = len;
    obj.value = value;
    var bBig =  htl === undefined? true:htl;
    obj.htl = bBig;
    obj.offset = offset;
    return obj;
}


function SocketData(arraybuffer)
{
    this.offset = 0;
    this.writeMap = [];

    this.m_nBufPos = window.PACKET_HEADER_SIZE;
    this.m_nPacketSize = window.PACKET_HEADER_SIZE;

    this.aDataArray = null ;
    if (arraybuffer) {
        this.aDataArray = new DataView(arraybuffer);
    }
}

//---------------------包头特殊

SocketData.prototype._writeHeaderByte = function(value,offset) {
    this.writeMap.push(item("headbyte", 1, value,true,offset));
}

SocketData.prototype._readHeaderByte = function(offset) {
    var value =  this.aDataArray.getUint8(offset,true)
    return value;
}

SocketData.prototype._writeHeaderShort = function(value,offset) {
    this.writeMap.push(item("headshort", 2, value,false,offset));
}

SocketData.prototype._readHeaderShort = function(offset) {
    var value =  this.aDataArray.getInt16(offset,false)
    return value;
}

SocketData.prototype._writeHeaderInt = function(value,offset) {
    this.writeMap.push(item("headint", 4, value,false,offset));
}

SocketData.prototype._readHeaderInt = function(offset) {
    var value =  this.aDataArray.getInt32(offset,false)
    return value;
}





//-------------------------byte---------------------

SocketData.prototype.WriteByte = function(value,bBig) {
    this.writeMap.push(item("int8", 1, value,bBig));
}
SocketData.prototype.ReadByte = function(bBig) {
    if(this.checkReadOut(1)){
        return 0;
    }
    var htl =  bBig === undefined? true:bBig;
    var value = this.aDataArray.getUint8(this.offset, htl)
    this.offset += 1
    return value;
}

//-----------------------short---------------------

SocketData.prototype.WriteShort = function(value,bBig) {
    var htl =  bBig === undefined? false:bBig;
    this.writeMap.push(item("int16", 2, value,htl));
}
SocketData.prototype.ReadShort = function(bBig) {
    if(this.checkReadOut(2)){
        return 0;
    }
    var htl =  bBig === undefined? false:htl;
    var value = this.aDataArray.getInt16(this.offset, htl)
    this.offset += 2
    return value;
}

//-----------------------int---------------------

SocketData.prototype.WriteInt = function(value,bBig) {
    var htl =  bBig === undefined? false:bBig;
    this.writeMap.push(item("int32", 4, value,htl));
}
SocketData.prototype.ReadInt = function(bBig) {
    if(this.checkReadOut(4)){
        return 0;
    }
    var htl =  bBig === undefined? false:bBig;
    var value = this.aDataArray.getInt32(this.offset, htl)
    this.offset += 4
    return value;
}


//-----------------------int64---------------------
SocketData.prototype.WriteInt64 = function(value,bBig) {
    var htl =  bBig === undefined? false:bBig;
    this.writeMap.push(item("int64", 8, value,htl));
}

SocketData.prototype.ReadInt64 = function(bBig) {
    if(this.checkReadOut(8)){
        return 0;
    }

    var htl =  bBig === undefined ? false : bBig;
    var low = this.aDataArray.getUint32(this.offset, htl)
    this.offset += 4
    var higt = this.aDataArray.getUint32(this.offset, htl)
    this.offset += 4
    var longVal = new Long(higt,low, false);
    return longVal.toNumber();
}

//-----------------------string---------------------

SocketData.prototype.WriteString = function(value,bBig) {
    var htl =  bBig === undefined? false:bBig;
    var result = value.toUtf8();
    this.writeMap.push(item("string", result.bytelens + 4 + 1, result,htl)); // +4 是因为字符串前面要写入一个长度
}
SocketData.prototype.ReadString = function(bBig) {

    if(this.checkReadOut(4)){
        return "";
    }

    var htl =  bBig === true? false:bBig;
    var len = this.aDataArray.getInt32(this.offset);
    this.offset += 4;
    var bytes = [];
    for (var i = 0; i < len; ++i)
    {
        var b = this.ReadByte();
        // var b = this.aDataArray.getUint8(this.offset);
        bytes.push(b);
        // this.offset += 1;
    }
    return utfbytes2string(bytes);
}


SocketData.prototype.getAllLength = function() {
    var allLen =window.PACKET_HEADER_SIZE;
    for (var i = 0; i < this.writeMap.length; ++i)
    {
        if(this.writeMap[i].type.indexOf("head") == -1){
            allLen += this.writeMap[i].len
        }

    }
    return allLen;
}


SocketData.prototype.checkReadOut = function (length) {
    if((this.offset +length) >  this.aDataArray.byteLength ){
        return true;
    }
    return false ;
}


SocketData.prototype._getbuffer = function() {

    var allLen = this.getAllLength();

    var arraybuffer = new ArrayBuffer(allLen);

    this.aDataArray = new DataView(arraybuffer);

    var offset = window.PACKET_HEADER_SIZE;;

    for (var i = 0; i < this.writeMap.length; ++i)
    {
        var value = this.writeMap[i].value ;
        var htl = this.writeMap[i].htl
        switch (this.writeMap[i].type)
        {

            case "headbyte":
                this.aDataArray.setUint8(this.writeMap[i].offset, value,htl);
                break ;

            case "headshort":
                this.aDataArray.setInt16(this.writeMap[i].offset, value,htl);
                break ;

            case "headint":
                this.aDataArray.setInt32(this.writeMap[i].offset, value,htl);
                break ;

            case "int8":
                this.aDataArray.setUint8(offset, value,htl);
                offset += 1;
                break;

            case "int16":
                this.aDataArray.setInt16(offset, value,htl);
                offset += 2;
                break;

            case "int32":
                this.aDataArray.setInt32(offset, value,htl);
                offset += 4;
                break;

            case "string":
                // 写入长度
                this.aDataArray.setInt32(offset, this.writeMap[i].value.bytelens+1,htl);
                offset += 4;

                // 写入字节数据
                var codes = this.writeMap[i].value.codes;for (var n = 0; n < codes.length; ++n)
            {
                var code = codes[n].code;
                var len = codes[n].bytelen;
                for (var t = 0; t < len; ++t)
                {
                    var b = (code >> (t * 8)) & 0xff;
                    this.aDataArray.setUint8(offset, b);
                    offset += 1;
                }
            }


                this.aDataArray.setUint8(offset, 0);
                offset += 1;
                break;

            case "int64":
                var langValue = Long.fromValue(this.writeMap[i].value,htl);
                var bytes = langValue.toBytesBE();

                for (var j = 0; j < bytes.length; j++)
                {
                    this.aDataArray.setUint8(offset + j, bytes[j]);
                }
                offset += 8;

                break;

            default:
                break;
        }
    }
    this.m_nPacketSize = offset;
    return arraybuffer;
}

SocketData.prototype.setOffset = function(offset){
    this.offset = offset ;
}

SocketData.prototype. _reset = function(){
    this.offset = 0;
    this.writeMap = [];
    this.m_nBufPos = window.PACKET_HEADER_SIZE;
    this.m_nPacketSize = window.PACKET_HEADER_SIZE;
    this.m_isCheckCode = false;
}


SocketData.prototype.Begin =function( nCommand,  uid ,  cVersion ){
    this._begin(nCommand, uid, cVersion);
    this.m_isCheckCode = false;
}

SocketData.prototype._begin = function ( nCommand,  uid,  cVersion){
    this._reset();
    var cmd = nCommand;
    var uid = uid;
    var source = window.SOURCE_TYPE;

    this._writeHeaderByte(cVersion,4); // 版本号
    this._writeHeaderShort(cmd,5); // 命令码
    this._writeHeaderByte(source,11); // 消息来源

    var type = window.GAME_ID;
    this. _writeHeaderByte(type,12);
    this. _writeHeaderInt(uid,13);
};

SocketData.prototype.SetOptType = function(value) {
    this._writeHeaderByte(value, 12);
};


SocketData.prototype.End = function(){
    this.m_isCheckCode = false;
    this._end();
}

SocketData.prototype._end = function(){
    var nBody = this.getAllLength() - 4 ;	//数据包长度包括命令头和body,4个字节是数据包长度
    var len = nBody;
    this._writeHeaderInt(len,0);	// 包正文长度
    var code = 0;
    this._writeHeaderByte(code, 17);	//效验码
};

SocketData.prototype.IsWriteCheckCode = function(){
    return this.m_isCheckCode;
};



/*整个包的长度*/
SocketData.prototype. GetBodyLength = function ()
{
    var nLen;
    nLen =  this._readHeaderInt( 0);
    return nLen;
}




SocketData.prototype.EncryptBuffer = function(){
    if(this.IsWriteCheckCode())
        return ;

    this._getbuffer();

    var wDataSize = this.GetBodyLength() - window.PACKET_HEADER_SIZE + 4;
    var EnCode = Math.floor(Math.random() * (window.MAX_ENCRYPT_MAP))
    EnCode = 0 ;
    var EnCodeNum = m_EncryptMap[EnCode];
    var CheckCode=0;

    for ( var i = 0 ; i < wDataSize ; i++ )
    {
        var data = this.aDataArray.getUint8(window.PACKET_HEADER_SIZE +i,true);
        CheckCode += data;
        CheckCode &= 0xff;
        data ^= EnCodeNum;
        data &= 0xff;
        this.aDataArray.setUint8(window.PACKET_HEADER_SIZE +i, data,true);
    }

    this.SetEnCode(EnCode);
    this.WriteCheckCode((~CheckCode+1) & 0xff);

    return  this.aDataArray.buffer;
}


SocketData.prototype.CrevasseBuffer = function(){

    var wDataSize = this.GetBodyLength()- window.PACKET_HEADER_SIZE +4;
    var EnCode = this.GetEnCode();
    if(EnCode >= window.MAX_ENCRYPT_MAP)
    {
        return -1 ;
    }

    var EnCodeNum = m_EncryptMap[EnCode];
    var CheckCode = this.GetCheckCode();

    for(var i = 0 ; i < wDataSize; i++ ){
        var data = this.aDataArray.getUint8(window.PACKET_HEADER_SIZE +i,true);
        data &= 0xff;
        data ^= EnCodeNum;

        CheckCode &= 0xff;
        CheckCode += data;
        this.aDataArray.setUint8(window.PACKET_HEADER_SIZE +i, data,true);

    }
    if((CheckCode & 0xff)!=0)
    {
        return -1;
    }

    return wDataSize;

}



SocketData. prototype.SetEnCode = function(i)
{
    // this._writeHeaderByte(i, 8);
    this.aDataArray.setUint8(8, i,true);
}

SocketData.prototype.GetEnCode = function(){
    var encode = this._readHeaderByte(8);
    return encode ;
}


SocketData. prototype.WriteCheckCode = function ( nValue)
{
    // this._writeHeaderByte(nValue,17);
    this.aDataArray.setUint8(17, nValue,true);
    this.m_isCheckCode = true;
}


SocketData. prototype. GetCheckCode = function()
{
    var code = this._readHeaderByte(17);
    return code;
}


SocketData.prototype.Reset = function(){
    this._reset();
}

SocketData.prototype.GetCmdType = function()
{
    var nCmdType = this._readHeaderShort(5);
    return nCmdType;
}


module.exports = SocketData;