const base_url = "http://54.205.32.51:2999";

function httpRequest(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
        	if (xmlhttp.status == 200)
        		cb(false, xmlhttp.responseText);
        	else if (xmlhttp.status == 404) {
        		console.log("status: URL not found");
        		cb(false, "Error: URL not found");
        	}
        	else {
        		console.log("status: invalid request");
        		cb(false, "Error: invalid request");
        	}
        }
    };
    xmlhttp.onerror = function() {
        cb(true, null);
    }
    xmlhttp.send();
}

function inflate(data, cb) {
    var url = base_url+"/inflate/"+data;
    console.log("main.js:inflate:"+url)
    httpRequest(url, function(err, result) {
        cb(err, result);
    });
}

function deflate(data, cb) {
    var url = base_url+"/deflate/"+data;
    httpRequest(url, function(err, result) {
        cb(err, result);
    });
}
