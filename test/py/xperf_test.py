import argparse
import time
import os, sys
import random
import string
import json

import myThread
from myRequest import MyRequest

MIN_THREAD = 1
MIN_LOOP = 1
MAX_THREAD = 100
MAX_LOOP = 1000

def randomUrl():
	rr = random.randint(1, 512)
	url = ''.join(random.choice(string.ascii_letters + string.digits+"!*'();:@&=\+$,/?#[]_.~-% ") for x in range(rr))
	return url
	
def runTest(params, threadName):
	request = params["target"]
	loop = params["loop"]
	print("thread(%s): starts for loop(%d)"%(threadName, loop))
	start = time.time()
	for _ in range(loop):
		orgUrl = randomUrl()
		shortUrl = request.deflate(orgUrl)
		if shortUrl is None:
			print("Error: deflate(%s)=>None"%orgUrl)
		else:
			shortUrl2 = request.deflate(orgUrl)
			if shortUrl != shortUrl2:
				print("Error: deflate: first != second")
			else:
				print("SUCCESS: deflate: first == second")
			longUrl = request.inflate(shortUrl)
			if longUrl is None:
				print("Error: inflate(%s)=>None"%shortUrl)
			elif orgUrl == longUrl:
				print("SUCCESS: inflate: original == new")
			else:
				print("Error: origin>>> "+orgUrl)
				print("Error: recove>>> "+longUrl)
	end = time.time()
	print("thread(%s): elapsed(%dms) for iter(%d)"% (threadName, (end-start)*1000.0, loop))
	

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--thread', dest='thread', type=int, action='store', default=1, help='# of thread')
    parser.add_argument('--loop', dest='loop', type=int, action='store', default=10, help='# of loop')
    args = parser.parse_args()

    num_thread = args.thread
    num_loop = args.loop

    if num_thread <= 0:
        num_thread = MIN_THREAD
    elif num_thread > MAX_THREAD:
        num_thread = MAX_THREAD

    if num_loop <= 0:
        num_loop = MIN_LOOP
    elif num_loop > MAX_LOOP:
        num_loop = MAX_LOOP

    try:
        with open("../config.json", 'r') as infile:
            config = json.load(infile)
    except Exception as ex:
    	print("Exception: "+str(ex))
        config = {
        	"base_url": "localhost",
        	"base_port": 2999
        }

    request = MyRequest(config["base_url"], config["base_port"])
    params = {
        "target": request,
        "loop": num_loop
    }

    print("(MAIN): Running with #thread=%d, #loop=%d"%(num_thread, num_loop))
    start = time.time()
    myThread.runTasks(num_thread, runTest, params)
    end = time.time()
    print("(MAIN): Total elapsed: %d second(s)"%(end-start))
