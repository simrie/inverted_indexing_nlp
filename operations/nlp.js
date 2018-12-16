"use strict";

/*
    Functions using the wink library
    for nlp to stem and tokenize
 */

const _ = require('lodash');
const nlpUtil = require('wink-nlp-utils');

const getStems = (stringArray) => {
    let returnText = stringArray.join(" ");
    returnText = nlpUtil.string.removeHTMLTags(returnText);
    returnText = nlpUtil.string.retainAlphaNums(returnText);
    returnText = nlpUtil.string.removeElisions(returnText);
    returnText = nlpUtil.string.removePunctuations(returnText);
    returnText = nlpUtil.string.removeSplChars(returnText);
    returnText = nlpUtil.string.lowerCase(returnText);
    const tokens = nlpUtil.string.tokenize(returnText);
    const stems = nlpUtil.tokens.stem(tokens);
    return _.uniq(stems);
};

const nlp = (() => {
    return {
        getStems
    }
})();

if ('undefined' !== typeof module) {
    module.exports = nlp;
}
