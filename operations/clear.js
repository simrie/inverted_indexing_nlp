"use strict";

/*
    clear the stored indexes
 */

const store = require('./store');

const doClear = () => {
    store.crawlDepth = 0;
    store.indexEntries = {};
    store.indexStems = {};
    return 'Index Cleared';
};

const clear = (() => {
    return {
        doClear
    }
})();

if ('undefined' !== typeof module) {
    module.exports = clear;
}