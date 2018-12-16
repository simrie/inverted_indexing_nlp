"use strict";

/*
    search for the web site titles containing the words
 */

const _ = require('lodash');
const store = require('./store');
const nlp = require('./nlp');

const findEntriesByStem = (stringArray) => {
    const stems = nlp.getStems(stringArray);
    const result = {};
    _.forEach(stems, stem => {
        result[stem] = store.indexStems[stem];
    });
    console.log('findEntriesByStem ', result);
    return result;
}

const doSearch = (searchTerms) => {
    const stringArray = searchTerms.split(' ');
    return findEntriesByStem(stringArray);
};

const searching = (() => {
    return {
        doSearch
    }
})();

if ('undefined' !== typeof module) {
    module.exports = searching;
}