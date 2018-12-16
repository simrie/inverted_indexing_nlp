"use strict";

/*
    clear the stored indexes
 */

const doClear = () => {
    return 'cleared out memory';
};

const clear = (() => {
    return {
        doClear
    }
})();

if ('undefined' !== typeof module) {
    module.exports = clear;
}