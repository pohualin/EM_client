'use strict';

angular.module('emmiManager')

/**
 * Manage users
 */
    .controller('UsersMainCtrl', ['$scope', '$controller', 'URL_PARAMETERS', 'UsersService', '$alert',
        function ($scope, $controller, URL_PARAMETERS, UsersService, $alert) {

            /**
             * Set deactivationPopoverOpen to isOpen for the user
             */
            $scope.deactivationPopoverOpen = function (user, isOpen) {
                UsersService.deactivatePopoverOpen(user, isOpen);
            };

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
                $scope.serializeToQueryString('', URL_PARAMETERS.USER, null, null);
                $scope.loading = true;
                UsersService.list('', null).then(
                    function (response) {
                        $scope.handleResponse(response, 'users');
                        $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                    }, function () {
                        $scope.loading = false;
                    });
                $scope.sortProperty = null;
            };

            /**
             * Called when column header is clicked to change sorting property
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                $scope.serializeToQueryString('', URL_PARAMETERS.USER, null, sort);
                UsersService.list('', sort).then(
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
                UsersService.toggleActivation(userResource).then(function (response){
                    var savedUser = response.data;
                    var message = 'User <b>' + savedUser.login + '</b>';
                    // status has changed
                    if (savedUser.active){
                        // now activated
                        message += ' is now active.';
                    } else {
                        // now deactivated
                        message += ' has been deactivated.';
                    }
                    $alert({
                        content: message
                    });
                });
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $controller('CommonSearch', {$scope: $scope});
                $scope.searchPerformed = false;
                $scope.search();
            }

            init();
        }]);
