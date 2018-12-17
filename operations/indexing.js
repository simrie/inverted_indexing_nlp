"use strict";

/*
    index the words on the web site
 */

const _ = require('lodash');
const cheerio = require('cheerio');
const gotten = require('./gotten');
const nlp = require('./nlp');
const store = require('./store');

const indexVectors = (crawl) => {
    const entry = crawl.entry;
    const indexEntries = store.indexEntries;
    if (!_.includes(_.keys(indexEntries), entry)) {
        indexEntries[entry] = crawl.title;
    }
    console.log('\nIndexVectors: indexEntries  ', _.keys(indexEntries).length);
    return crawl;
}

const reverseIndex = (crawl) => {
    const stems = crawl.stems;
    const entry = crawl.entry;
    const indexStems = store.indexStems;
    _.forEach(stems, stem => {
        let entries;
        if (indexStems[stem]) {
            entries = indexStems[stem];
        } else {
            entries = [];
        }
        if (!_.includes(entries, entry)) {
            entries.push(entry);
        }
        indexStems[stem] = entries;
    });
    _.unset(crawl, 'stems');
    console.log('\nReverseIndex: indexStems ', _.keys(indexStems).length);
    return crawl;
}

async function crawlHrefs(crawl) {
    const crawls = [];
    if (!crawl.ahrefs) return crawls;
    const indexEntries = store.indexEntries;
    store.crawlDepth = store.crawlDepth +1;
    if (store.crawlDepth > store.crawlDepthMax) {
        return crawls;
    }
    const ahrefs = crawl.ahrefs;
    console.log('crawlDepth ', store.crawlDepth);
    console.log('crawl Hrefs ', ahrefs.length);
    const indexedEntries = _.keys(indexEntries);
    _.forEach(ahrefs, ahref => {
        if (!_.includes(indexedEntries, ahref)) {
            crawls[ahref] = doIndex(ahref);
        }
    })
    _.unset(crawl, 'ahrefs');
    return crawls;
}

const cheerioCrawl = (text) => {
    if (!text) return {};
    const ahrefs = [];
    const $ = cheerio.load(text);
    $('a').each( (index, value) => {
        var link = $(value).attr('href');
        if (link && link.startsWith('http')) {
            if (!_.includes(ahrefs, link)) {
                ahrefs.push(link);
            }
        }
    });
    const textToTokenize = cheerioTextExtract($('body'));
    return {
        ahrefs,
        textToTokenize
    };
}

function cheerioTextExtract(node) {
    //https://stackoverflow.com/questions/39176526/iterate-over-source-page-with-cheerio-and-performing-logic
    const $ = cheerio;
    const tokenizeEligible = ['tag', 'text'];
    const textToTokenize = [];
    node.children().each(function(ix, el) {
        const $el = $(el);
        const elType = $el[0].type;
        const t = $(this).text();
        if (t) {
            textToTokenize.push(t);
        }
        if (_.includes(tokenizeEligible, elType)) {
            const more = cheerioTextExtract($el);
            _.forEach(more, t => {
                textToTokenize.push(t);
            })
        }
    });
    return textToTokenize;
}

const cheerioTag = (text, tag) => {
    if (!text || !tag) return '';
    const $ = cheerio.load(text);
    const elem = $(tag);
    return elem.text();
}

async function doIndex(entry) {
    if (!entry) return {};
    if (!entry.startsWith('http')) return {};
    let text;
    let title;
    let crawl;
    let stringArray;
    try {
        text = await gotten(entry);
        title = cheerioTag(text, 'title');
        crawl = cheerioCrawl(text);
        crawl.title = title;
        crawl.entry = entry;
        stringArray = _.uniq(_.flattenDeep(crawl.textToTokenize));
        crawl.stems = nlp.getStems(stringArray);
        _.unset(crawl, 'textToTokenize');
        crawl = reverseIndex(crawl);
        crawl = indexVectors(crawl);
        crawl.crawls = await crawlHrefs(crawl);
        return { entry: { entry, crawl, crawls: crawl.crawls.length } };
    } catch(err) {
        console.log(err);
        return { err };
    }
}

const indexing = (() => {
    return {
        doIndex
    }
})();

if ('undefined' !== typeof module) {
    module.exports = indexing;
}