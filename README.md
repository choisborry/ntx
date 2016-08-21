# ntx URL shortening service

## code structure
ntx
    public - web service pages
    routes - web api handler
    test - service test programs
        js - mocha/nodejs tests
        py - python tests
    app.js - express http server
    config.json - web server configuration
    README.md - this file

## test program usage
mocha/nodejs
    sh> mocha funcTest.js

python
    sh> python xperf_test.py [--thread <#thread>] [--loop <#loop>]
    sh> python stress_test.py [--thread <#thread>] [--loop <#loop>] [--duration <seconds>]

## configuration(config.json) sample
{
    "mysql": {
      "server": "localhost",
      "username": "myname",
      "password": "mypassword,
      "database": "mydatabase"
    },
    "http": {
      "server": "localhost",
      "port": 2999
    }
}