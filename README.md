# shiftarray.com

[![Build Status](https://travis-ci.org/logashoff/shiftarray.com.svg?branch=master)](https://travis-ci.org/logashoff/shiftarray.com) [![Dependency Status](https://david-dm.org/logashoff/shiftarray.com.svg)](https://david-dm.org/logashoff/shiftarray.com) [![devDependency Status](https://david-dm.org/logashoff/shiftarray.com/dev-status.svg)](https://david-dm.org/logashoff/shiftarray.com#info=devDependencies)

## Usage

Requires Node.js 4.1 or higher.

For Twitter API to work ```TWITTER_CONSUMER_KEY```, ```TWITTER_CONSUMER_SECRET```, ```TWITTER_ACCESS_TOKEN_KEY``` and ```TWITTER_ACCESS_TOKEN_SECRET``` need to be set as enviroment variables or hard-coded inside ```twitter.js```. Twitter user id is hard-coded inside ```twitter.js``` and is used as part of Twitter API request parameters. Change it to get a different user timeline.

## Install

Install dependencies and do initial build:
```
npm install -g grunt-cli
npm install
grunt build
```

Run server on port 8080 as defined in ```server.js```:
```
node server.js
```
