"use strict";

/*
    Persistent store of the
    indexed web sites, indexEntries
         and
    indexed words in stem form, indexStems
 */

const indexEntries = {};
const indexStems = {};
let crawlDepth = 0;
const crawlDepthMax = 3;

const store = (() => {
    return {
        indexEntries,
        indexStems,
        crawlDepthMax,
        crawlDepth
    }
})();

if ('undefined' !== typeof module) {
    module.exports = store;
}

