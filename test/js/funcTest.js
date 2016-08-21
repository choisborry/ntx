var chai = require('chai');
var os = require('os');
var glob = require('glob');
var fs = require('fs');
var MyRequest = require('./myRequest.js');

const MAX_URL_LENGTH = 512;
const MIN_URL_LENGTH = 1;
const MAX_SHORTURL_LENGTH = 8;
const MIN_SHORTURL_LENGTH = 1;

const shorturl_base = "http://ntx.co/";
var config;
try {
	config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
}
catch (e) {
	config = {
    	"base_url": "localhost",
    	"base_port": 2999
	};
}

var request = new MyRequest(config.base_url, config.base_port);

var randomUrl = function(fixed) {
	var rr;
	if (fixed == 0)
		rr = Math.ceil(Math.random() * MAX_URL_LENGTH)
	else
		rr = fixed;
	
    var url = "";
    var candidate = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*'();:@&=\+$,/?#[]_.~-% ";
    var len_candidate = candidate.length;

    for (var i = 0; i < rr; i++)
        url += candidate.charAt(Math.floor(Math.random() * len_candidate));

    return url;
}
var randomShortUrl = function(fixed) {
	var rr;
	if (fixed == 0)
		rr = Math.ceil(Math.random() * MAX_SHORTURL_LENGTH)
	else
		rr = fixed;
	
    var url = "";
    var candidate = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var len_candidate = candidate.length;

    for (var i = 0; i < rr; i++)
        url += candidate.charAt(Math.floor(Math.random() * len_candidate));

    return shorturl_base+url;
}

var expect = chai.expect;
var assert = chai.assert;
chai.should();

describe("[UrlShorten.Function]", function() {
    describe("[UrlShorten.Function.Deflate]", function() {
    	var savedLongUrl = null;
    	var savedShortUrl = null;
    	
        before(function () {
            chai.config.includeStack = false;
        });
        it("shrink empty url", function(done) {
        	var orgUrl = "";
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, true, 'deflate: return success - '+result);
        		assert.equal(result == 404, true, 'deflate: expected(404), actual('+result+')');
        		done();
        	});
        })
        it("shrink min length url", function(done) {
        	var orgUrl = randomUrl(MIN_URL_LENGTH);
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, false, 'deflate: return error - '+result);
        		done();
        	});
        })
        it("shrink max length url", function(done) {
        	var orgUrl = randomUrl(MAX_URL_LENGTH);
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, false, 'deflate: return error - '+result);
        		done();
        	});
        })
        it("shrink bigger than max length url", function(done) {
        	var orgUrl = randomUrl(MAX_URL_LENGTH+1);
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, true, 'deflate: return success - '+result);
        		assert.equal(result == 400, true, 'deflate: expected(400), actual('+result+')');
        		done();
        	});
        })
        it("shrink valid random length url, expand back, compare to original url", function(done) {
        	var orgUrl = randomUrl(0);
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, false, 'deflate: return error - '+result);
        		var shortUrl = result;
            	request.inflate(shortUrl, function(err, result) {
            		assert.equal(err, false, 'inflate: return error - '+result);
            		var newUrl = result;
            		assert(orgUrl.localeCompare(newUrl) == 0, true, 'inflate: orginal != new');
            		done();
            	});
        	});
        })
        it("shrink valide random url twice, compare short urls", function(done) {
        	var orgUrl = randomUrl(0);
        	request.deflate(orgUrl, function(err, result) {
        		assert.equal(err, false, 'deflate: return error - '+result);
        		var shortUrl = result;
            	request.deflate(orgUrl, function(err, result) {
            		assert.equal(err, false, 'deflate: return error - '+result);
            		var shortUrl2 = result;
            		assert(shortUrl.localeCompare(shortUrl2) == 0, true, 'deflate: first != second');

            		// save urls for next test
            		savedLongUrl = orgUrl;
            		savedShortUrl = shortUrl2;
            		done();
            	});
        	});
        })
        it("shrink valid short url twice, compare long urls", function(done) {
        	if (savedLongUrl == null || savedShortUrl == null) {
        		done();
        		return;
        	}
        	var shortUrl = savedShortUrl;
        	request.inflate(shortUrl, function(err, result) {
        		assert.equal(err, false, 'inflate: return error - '+result);
        		var longUrl = result;
            	request.inflate(shortUrl, function(err, result) {
            		assert.equal(err, false, 'inflate: return error - '+result);
            		var longUrl2 = result;
            		assert(longUrl.localeCompare(longUrl2) == 0, true, 'inflate: first != second');
            		assert(longUrl.localeCompare(savedLongUrl) == 0, true, 'inflate: orginal != expanded')
            		done();
            	});
        	});
        })
    })
    describe("[UrlShorten.Function.Inflate]", function() {
        before(function () {
            chai.config.includeStack = false;
        });
        it("expand empty short url", function(done) {
        	var shortUrl = "";
        	request.inflate(shortUrl, function(err, result) {
        		assert.equal(err, true, 'inflate: return success - '+result);
        		assert.equal(result == 404, true, 'inflate: expected(404), actual('+result+')');
        		done();
        	});
        })
        it("expand min length short url", function(done) {
        	var shortUrl = randomShortUrl(MIN_SHORTURL_LENGTH);
        	request.inflate(shortUrl, function(err, result) {
        		if (err) {
        			assert.notEqual(result, 500, 'inflate: return error - '+result);
        		}
        		done();
        	});
        })
        it("expand max length short url", function(done) {
        	var shortUrl = randomShortUrl(MAX_SHORTURL_LENGTH);
        	request.inflate(shortUrl, function(err, result) {
        		if (err) {
        			assert.notEqual(result, 500, 'inflate: return error - '+result);
        		}
        		done();
        	});
        })
        it("expand bigger than max length short url", function(done) {
        	var shortUrl = randomShortUrl(MAX_SHORTURL_LENGTH+1);
        	request.inflate(shortUrl, function(err, result) {
        		assert.equal(err, true, 'inflate: return success - '+result);
        		assert.equal(result == 400, true, 'inflate: expected(400), actual('+result+')');
        		done();
        	});
        })
        it("expand wrong prefix short url", function(done) {
        	var shortUrl = randomShortUrl(0).replace('co','com');
        	request.inflate(shortUrl, function(err, result) {
        		assert.equal(err, true, 'inflate: return success - '+result);
        		assert.equal(result == 400, true, 'inflate: expected(400), actual('+result+')');
        		done();
        	});
        })
        it("expand invalid short url string", function(done) {
        	var shortUrl = randomShortUrl(0).substring(shorturl_base.length).replace(/[a-zA-Z0-9]/, '#');
        	request.inflate(shortUrl, function(err, result) {
        		assert.equal(err, true, 'inflate: return success - '+result);
        		assert.equal(result == 400, true, 'inflate: expected(400), actual('+result+')');
        		done();
        	});
        })
        it("expand any valid short url", function(done) {
        	var shortUrl = randomShortUrl(0);
        	request.inflate(shortUrl, function(err, result) {
        		if (err) {
        			assert.notEqual(result, 500, 'inflate: return error - '+result);
        		}
        		done();
        	});
        })
    })
})

