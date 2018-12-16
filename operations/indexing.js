"use strict";

/*
    index the words on the web site
 */


//const got = require('got');

const doIndex = (entry) => {
    //return async () => await got(entry)();
    console.log('entry is ', entry);
    return { entry };
};

const indexing = (() => {
    return {
        doIndex
    }
})();

if ('undefined' !== typeof module) {
    module.exports = indexing;
}