'use strict';

angular.module('emmiManager')

/**
 *   Controls the existing providers section
 */
    .controller('ClientProvidersController', ['$scope', '$controller', 'Client', 'ClientProviderService',
        function ($scope, $controller, Client, ClientProviderService) {

            $controller('CommonPagination', {$scope: $scope});

            $scope.pageSizes = [5, 10, 15, 25];

            var contentProperty = 'clientProviders';

            $scope.openDeletePopover = function (provider) {
                provider.deleting = true;
            };

            $scope.closeDeletePopover = function (provider) {
                provider.deleting = false;
            };

            $scope.performSearch = function (pageSize) {
                $scope.loading = true;
                ClientProviderService.findForClient(Client.getClient(), pageSize).then(function (clientProviderPage) {
                    $scope.handleResponse(clientProviderPage, contentProperty);
                }, function () {
                    // error happened
                    console.log('Error loading providers for a client');
                    $scope.loading = false;
                });
            };

            // when a page size link is used
            $scope.changePageSize = function (pageSize) {
                $scope.performSearch(pageSize);
            };

            // when a pagination link is used
            $scope.fetchPage = function (href) {
                $scope.loading = true;
                ClientProviderService.fetchPageLink(href).then(function (providerPage) {
                    $scope.handleResponse(providerPage, contentProperty);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

            $scope.performSearch();
        }])
;