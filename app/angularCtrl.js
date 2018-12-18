"use strict";

/*
    angularjs app
 */
const angularCtrl = ($scope, $http) => {
        const success = (response) => {
            console.log('success response', response);
            $scope.results = response.data;
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
};

if ('undefined' !== typeof module) {
    module.exports = angularCtrl;
}
