const base_url = "http://localhost:3000";

function httpRequest(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            cb(false, xmlhttp.responseText);
        }
    };
    xmlhttp.onerror = function() {
        cb(true, null);
    }
    xmlhttp.send();
}

function inflate(data, cb) {
    var url = base_url+"/inflate/"+data;
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