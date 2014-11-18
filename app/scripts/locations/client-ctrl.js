'use strict';

angular
    .module('emmiManager')

/**
 * Controls the existing providers section
 */
.controller(
    'LocationClientController', [
        '$scope',
        '$controller',
        'CommonService',
        'LocationService',
        function($scope, $controller, CommonService,
            LocationService) {

            $controller('CommonPagination', {
                $scope: $scope
            });

            $scope.pageSizes = [5, 10, 15, 25];

            var contentProperty = 'clientProviders';

            $scope.performSearch = function(pageSize) {
                $scope.loading = true;
                LocationService
                    .getCurrentClientsByLocation(
                        $scope.$parent.locationResource,
                        pageSize)
                    .then(
                        function(clientProviderPage) {
                            $scope.handleResponse(
                                clientProviderPage,
                                contentProperty);
                        },
                        function() {
                            // error happened
                            console
                                .log('Error loading clients for a provider');
                            $scope.loading = false;
                        });
            };

            // when a pagination link is used
            $scope.fetchPage = function(href) {
                $scope.loading = true;
                CommonService.fetchPage(href).then(
                    function(clientProviderPage) {
                        $scope.handleResponse(
                            clientProviderPage,
                            contentProperty);
                    }, function() {
                        // error happened
                        $scope.loading = false;
                    });
            };

            $scope.performSearch();
        }
    ]);
