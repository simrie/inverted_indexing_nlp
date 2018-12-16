"use strict";

/*
    angularjs app
 */

/*
const indexing = require('./indexing.js');
const searching = require('./searching.js');
const clear = require('./clear.js');
const angtest = require('./angtest.js');
*/

//const angularApp = angular.module('myApp').controller('myCtrl', function($scope) {
const angularCtrl = ($scope) => {
        $scope.results = angtest.nimportQuoi();
        $scope.clear = function() {
            $scope.results = clear.doClear();
        };
        $scope.index = function() {
            $scope.results = indexing.doIndex($scope.input);
        };
        $scope.search = function() {
            $scope.results = searching.doSearch($scope.input);
        };
        $scope.myFunc = function() {
            $scope.results = angtest.autrechose($scope.input);
        };
};

if ('undefined' !== typeof module) {
    module.exports = angularCtrl;
}
