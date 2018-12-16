"use strict";

/*
    index the words on the web site
 */


//const got = require('got');

const doIndex = (entry) => {
    //return async () => await got(entry)();
    console.log('entry is ', entry);
    const hardc = '<html><head><title>Title1</title></head><body><h1>Header1</h1></body><p>the Paragraph1 Content with a <a>Link a1</a></p></html>'

    /*
    async () => {
        try {
            //const response = await got.get(entry);
            console.log(response.body);
            return response.body;
            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
            return error.response.body;
        }
    }
    */
    //const sw = stopwords(hardc);
    //console.log(sw);
    const tokenized = AggressiveTokenizer(hardc);
    console.log(tokenized);

    return hardc;

    //return 'word count for ' + entry;
};

const indexing = (() => {
    return {
        doIndex
    }
})();

if ('undefined' !== typeof module) {
    module.exports = indexing;
}