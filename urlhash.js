var UrlHash = {};
const hashMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

UrlHash.url2index = function(url) {
	var index = 0;
   
	for (var x = url.length(); x >=0; x--) {
        if ('a' <= url[i] && url[i] <= 'z')
          index = index*62 + url[i] - 'a';
        if ('A' <= url[i] && url[i] <= 'Z')
          index = index*62 + url[i] - 'A' + 26;
        if ('0' <= url[i] && url[i] <= '9')
          index = index*62 + url[i] - '0' + 52;
    }
    return index;
}

UrlHash.index2url = function(index) {
	var shorturl = "";
    while (index > 0)
    {
        shorturl += hashMap[n%62];
        n = n/62;
    }
}

module.exports = UrlHash;
