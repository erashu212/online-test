"use strict";

const Promise = require('bluebird');
const cache = require('memory-cache');
const _ = require('lodash');

module.exports = class CacheManager {
    static get(key) {
        cache.get(key)
    }

    static save(key, dataSet) {
        cache.put(key, dataSet)
    }
}