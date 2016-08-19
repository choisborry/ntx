var UrlHash = {};
const hashMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const shorturl_base = "ntx.co";

UrlHash.shorturl2index = function(url) {
	console.log("shorturl2index: converting: "+url+"...");
	var index = 0;
	var pattern1 = "http://"+shorturl_base+"/";
	var pattern2 = shorturl_base+"/";
	
	if (url.startsWith(pattern1))
		url = url.substring(pattern1.length);
	else if (url.startsWith(pattern2))
		url = url.substring(pattern2.length);
	else {
		console.log("invalid short URL: "+url);
		return 0;
	}
	console.log("now we have: "+url);
	
	for (var x = url.length - 1; x >=0; x--) {
		var char = url[x];
		console.log("processing "+char);
        if ('a' <= char && char <= 'z')
          index = index*62 + char.charCodeAt(0) - 'a'.charCodeAt(0);
        if ('A' <= char && char <= 'Z')
          index = index*62 + char.charCodeAt(0) - 'A'.charCodeAt(0) + 26;
        if ('0' <= char && char <= '9')
          index = index*62 + char.charCodeAt(0) - '0'.charCodeAt(0) + 52;
    }
	console.log("returning "+index);
    return index;
}

UrlHash.index2shorturl = function(index) {
	console.log("index2shorturl: converting: "+index+"...");
	var shorturl = "";
    while (index > 0)
    {
    	var mod = index%62;
        shorturl += hashMap[mod];
        index = (index-mod)/62;
    }
    return "http://"+shorturl_base+"/"+shorturl;
}

module.exports = UrlHash;
