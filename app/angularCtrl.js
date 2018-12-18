"use strict";

/*
    angularjs app
 */

const angularCtrl = ($scope, $http) => {
        const success = (response) => {
            console.log('success response', response);
            if (response instanceof String) {
                $scope.stringResult = response;
                $scope.searchResults = {};
                $scope.stems = [];
            } else {
                $scope.stringResult = '';
                $scope.searchResults = response.data;
                $scope.stems = $scope.keys(response.data);
            }
            console.log($scope.stringResult);
            console.log($scope.searchResults);
            console.log($scope.stems);
        };
        const err = (err) => {
            console.log('err ', err);
            $scope.results = err;
        };
        $scope.clear = function() {
             $http.get('/clear').then(success, err);
        };
        $scope.index = function() {
            $scope.results = 'Indexing....';
            const urlIP = $scope.input;
            $http({
                url: '/index',
                method: 'POST',
                data: { 'urlIP' : urlIP },
                headers: {'Content-Type': 'application/json'}
            }).then(success, err);
        };
        $scope.search = function() {
            const searchParams = $scope.input;
            $http({
                url: '/search',
                method: 'POST',
                data: { 'words' : searchParams },
                headers: {'Content-Type': 'application/json'}
            }).then(success, err);
        };
        $scope.keys = function(col) {
            return Object.keys(col);
        };
        $scope.val = function(col, key) {
            return col[key];
        };
};

if ('undefined' !== typeof module) {
    module.exports = angularCtrl;
}
