# shiftarray.com

[![Build Status](https://travis-ci.org/pusharray/shiftarray.com.svg?branch=master)](https://travis-ci.org/pusharray/shiftarray.com) [![Dependency Status](https://david-dm.org/pusharray/shiftarray.com.svg)](https://david-dm.org/pusharray/shiftarray.com) [![devDependency Status](https://david-dm.org/pusharray/shiftarray.com/dev-status.svg)](https://david-dm.org/pusharray/shiftarray.com#info=devDependencies) [![Code Climate](https://codeclimate.com/github/pusharray/shiftarray.com/badges/gpa.svg)](https://codeclimate.com/github/pusharray/shiftarray.com)

## Usage

Requires Node.js 6.11.0 or higher.

For Twitter API to work ```TWITTER_CONSUMER_KEY```, ```TWITTER_CONSUMER_SECRET```, ```TWITTER_ACCESS_TOKEN_KEY``` and ```TWITTER_ACCESS_TOKEN_SECRET``` need to be set as enviroment variables or hard-coded inside ```twitter.js```. Twitter user id is hard-coded inside ```twitter.js``` and is used as part of Twitter API request parameters. Change it to get a different user timeline.

## Install

Install dependencies and do initial build:
```
npm install
npm run build
```

Run server on port 8080 as defined in ```server.js```:
```
node server.js
```
