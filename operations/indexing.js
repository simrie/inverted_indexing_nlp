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
    const title = crawl.title
    const indexEntries = store.indexEntries;
    if (!_.includes(_.keys(indexEntries), entry)) {
        indexEntries[entry] = title;
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
    console.log('crawlHrefs ', crawl);
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
            crawls[ahref] = index(ahref);
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

async function index(entry) {
    if (!entry) return {};
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
        return crawl;
    } catch(err) {
        console.log(err);
        return { err };
    }
};

async function reduceCrawls(crawls) {
    return _.reduce(crawls,
        async function reducer(result, crawl) {
            crawl.then(value => {
                const crawled = crawlHrefs(value);
                const subCrawls = [];
                subCrawls.push(crawled);
                return crawled.then(crawl2 => {
                    const ahrefs = _.keys(crawl2);
                    _.forEach(ahrefs, (ahref) => {
                        index(ahref).then(href =>
                            subCrawls.push(crawlHrefs(href))
                        ).catch();
                    });
                    return subCrawls;
                });
            }).catch([]);
        }, crawls);
};

async function doIndex(entry) {
    const crawls = [];
    const rootCrawl = index(entry);
    store.crawlDepth = 0;
    crawls.push(rootCrawl);
    return await reduceCrawls(crawls);
};

const getStatMessage = () => {
    const entries = _.keys(store.indexEntries).length;
    const stems = _.keys(store.indexStems).length;
    console.log('\nstore.indexEntries[0] \n', store.indexEntries[0]);
    console.log('\nstore.indexStems[0] \n', store.indexStems[0]);
    return `${stems} word stems indexed from ${entries} nested addresses`;
}

const indexing = (() => {
    return {
        doIndex,
        getStatMessage
    }
})();

if ('undefined' !== typeof module) {
    module.exports = indexing;
}