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
        const lookup = [];
        const entries = store.indexStems[stem];
        _.forEach(entries, entry => {
            const resultObject = {
                entry,
                title: store.indexEntries[entry]
            };
            lookup.push(resultObject);
        })
        result[stem] = lookup;
    });
    return result;
}

const doSearch = (searchTerms) => {
    if (!searchTerms) return 'No search terms supplied';
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