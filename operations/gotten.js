"use strict";

/*
    implementation of got
    for text results
 */

const got = require('got');

const options = {
    headers: {
        'Content-Type': 'application/text'
    },
    json: false,
    timeout: 1000,
    retries: 2,
    rejectUnauthorized: false
};

const gotten = (urlIP) =>
    got.get(urlIP, options)
        .catch((err) => {
            err.url = urlIP;
            return err;
        })
        .then(response => response.body);

if ('undefined' !== typeof module) {
    module.exports = gotten;
}