"use strict";

/*
    search for the web site titles containing the words
 */

const doSearch = (searchTerms) => {
    return 'list of matches';
};

const searching = (() => {
    return {
        doSearch
    }
})();

if ('undefined' !== typeof module) {
    module.exports = searching;
}