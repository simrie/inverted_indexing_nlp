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
const angularCtrl = ($scope, $http) => {
        //$http callback functions
        $scope.results = angtest.nimportQuoi();
        const success = (response) => {
            console.log('success response', response);
            $scope.results = response.data;;
        };
        const err = (err) => {
            console.log('err ', err);
            $scope.results = err;
        };
        $scope.clear = function() {
            //$scope.results = clear.doClear();
            $http.get('/clear').then(success, err);
        };
        $scope.index = function() {
            //$scope.results = indexing.doIndex($scope.input);
            const urlIP = $scope.input;
            $http({
                url: '/index',
                method: 'POST',
                data: { 'urlIP' : urlIP },
                headers: {'Content-Type': 'application/json'}
            }).then(success, err);
        };
        $scope.search = function() {
            //$scope.results = searching.doSearch($scope.input);
            const searchParams = $scope.input;
            //application/json
            //application/x-www-form-urlencoded
            $http({
                url: '/search',
                method: 'POST',
                data: { 'words' : searchParams },
                headers: {'Content-Type': 'application/json'}
            }).then(success, err);
        };
        $scope.myFunc = function() {
            $scope.results = angtest.autrechose($scope.input);
        };
};

if ('undefined' !== typeof module) {
    module.exports = angularCtrl;
}
