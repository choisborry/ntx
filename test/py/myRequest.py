import os, sys
import httplib, urllib
import time
import inspect

class MyRequest:
    def __init__(self, baseUrl, basePort):
        self.baseUrl = baseUrl
        self.basePort = basePort
        print("url="+baseUrl+":"+str(basePort))
        
    def deflate(self, longUrl):
        ts=time.time()
        conn = httplib.HTTPConnection(self.baseUrl, self.basePort)
        endpoint = "/deflate/"+urllib.quote(longUrl, safe='')
        
        header = {
        	"Content-type": "text/plain"
        }
        conn.request("GET", endpoint, None, header);
        response = conn.getresponse()
        te=time.time()
        print("XTIME: %s=%dms"%(inspect.currentframe().f_code.co_name, (te-ts)*1000.0))
        if response.status != 200:
            print("ERROR: deflate failed - endpoint({0}), status({1})".format(endpoint, response.status))
            print("                            message({0}))".format(response.read()))
            return None
        data = response.read()
        #print("deflate:rsp="+data)
        return data

    def inflate(self, shortUrl):
        ts=time.time()
        conn = httplib.HTTPConnection(self.baseUrl, self.basePort)
        endpoint = "/inflate/"+urllib.quote(shortUrl, safe='')
        
        header = {
        	"Content-type": "text/plain"
        }
        conn.request("GET", endpoint, None, header);
        response = conn.getresponse()
        te=time.time()
        print("XTIME: %s=%dms"%(inspect.currentframe().f_code.co_name, (te-ts)*1000.0))
        if response.status != 200:
            print("ERROR: inflate failed - endpoint({0}), status({1})".format(endpoint, response.status))
            print("                            message({0}))".format(response.read()))
            return None
        data = response.read()
        #print("inflate:rsp="+data)
        return data

if __name__ == "__main__":
	request = MyRequest("localhost", 2999)
	request.deflate("www.google.com")