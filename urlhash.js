var UrlHash = {};
const hashMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

UrlHash.shorturl2index = function(url) {
	//console.log("shorturl2index: converting: "+url+"...");
	var index = 0;
	for (var x = url.length - 1; x >=0; x--) {
		var char = url[x];
        if ('a' <= char && char <= 'z')
          index = index*62 + char.charCodeAt(0) - 'a'.charCodeAt(0);
        if ('A' <= char && char <= 'Z')
          index = index*62 + char.charCodeAt(0) - 'A'.charCodeAt(0) + 26;
        if ('0' <= char && char <= '9')
          index = index*62 + char.charCodeAt(0) - '0'.charCodeAt(0) + 52;
    }
    return index;
}

UrlHash.index2shorturl = function(index) {
	//console.log("index2shorturl: converting: "+index+"...");
	var shorturl = "";
    while (index > 0)
    {
    	var mod = index%62;
        shorturl += hashMap[mod];
        index = (index-mod)/62;
    }
    return shorturl;
}

module.exports = UrlHash;
