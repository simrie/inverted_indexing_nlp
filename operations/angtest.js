"use strict";

/*
    angular functions for index
 */

const nimportQuoi = () => {
    return 'whatever';
};

const autrechose = (input) => {
    return input + ' something else';
};

const angtest = (() => {
    return {
        nimportQuoi,
        autrechose
    }
})();

if ('undefined' !== typeof module) {
    module.exports = angtest;
}
