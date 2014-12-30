'use strict';

angular.module('emmiManager')

/**
 * Manage users
 */
    .controller('UsersMainCtrl', ['$scope', '$controller', 'UsersService',
        function ($scope, $controller, UsersService) {

            /**
             * Called when fetching different pages
             */
            $scope.fetchPage = function (href) {
                $scope.loading = true;
                UsersService.fetchPage(href).then(function (users) {
                    $scope.handleResponse(users, 'users');
                }, function () {
                    $scope.loading = false;
                });
            };

            /**
             * Called when GO button is clicked
             */
            $scope.search = function () {
                if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
                    $scope.serializeToQueryString($scope.query, 'u', null, null);
                    $scope.loading = true;
                    UsersService.list($scope.query, null).then(
                        function (response) {
                            $scope.handleResponse(response, 'users');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function () {
                            $scope.loading = false;
                        });
                    $scope.sortProperty = null;
                }
            };

            /**
             * Called when column header is clicked to change sorting property
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                $scope.serializeToQueryString($scope.query, 'u', null, sort);
                UsersService.list($scope.query, sort).then(
                    function (response) {
                        $scope.handleResponse(response, 'users');
                    }, function () {
                        $scope.loading = false;
                    });
                $scope.sortProperty = null;
            };

            /**
             * Called when deactivate is clicked in the table
             *
             * @param userResource to be deactivated
             */
            $scope.toggleActivation = function (userResource) {
                UsersService.toggleActivation(userResource);
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $controller('CommonSearch', {$scope: $scope});
                $scope.searchPerformed = false;

                // Initiate a search when $scope.query is not empty
                if ($scope.query) {
                    $scope.serializeToQueryString($scope.query, 'u', null, null);
                    UsersService.list($scope.query, null).then(
                        function (response) {
                            $scope.handleResponse(response, 'users');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function () {
                            $scope.loading = false;
                        });
                    $scope.sortProperty = null;
                }
            }

            init();
        }]);