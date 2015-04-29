'use strict';
angular.module('emmiManager')

    .controller('ProviderSearchController', function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client) {

        $controller('CommonSearch', {$scope: $scope});

        var searchedProvidersList = 'searchedProvidersList';

        /**
         * Called when search button is clicked from search all provider tab
         */
        $scope.search = function (isValid) {
            if (isValid) {
                $scope.noSearch = false;
                ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status)
                .then(function (providerPage) {
                    $scope.handleResponse(providerPage, 'searchedProvidersList');
                });
            }
        };
 
        /**
         * Called when status changed
         */
        $scope.statusChange = function () {
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status)
            .then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Called to fetch another page of possible providers by given href
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Fetch next/previous page in Client Providers tab
         */
        $scope.fetchPageClientProviders = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'clientProviders');
                $scope.setClientProviderSelected($scope.clientProviders);
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Called when a column header in search all provider result table is clicked.
         */
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status, sort, $scope.currentPageSize)
            .then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
        /**
         * Called when a column header in client providers result table is clicked.
         */
        $scope.sortClientProviders = function (property) {
            var sort = $scope.createSortProperty(property);
            $scope.loading = true;
            ClientProviderService.findForClient(Client.getClient(), sort).then(function (clientProviders) {
                $scope.handleResponse(clientProviders, managedClientProviderList);
                $scope.setClientProviderSelected($scope.clientProviders);
            }, function(){
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Called when check box checked or unchecked from both tabs
         */
        $scope.onCheckboxChange = function (provider) {
            var request = {};
            request.teamLocations = [];
            provider.entity.teamLocations = [];

            if (provider.entity.checked) {
                provider.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
                if (provider.entity.selectedTeamLocations.length > 0) {
                    provider.entity.showLocations = true;
                }
                request.provider = provider.entity;
                $scope.teamProviderTeamLocationSaveRequest.push(request);
            }
            else {
                provider.entity.showLocations = false;
                request.provider = provider.entity;
                $scope.teamProviderTeamLocationSaveRequest.splice(request.provider.entity, 1);
            }
        };

        $scope.setCheckboxesForChanged = function (providers) {
            angular.forEach(providers, function (searchedTeamProvider) {
                angular.forEach($scope.teamProviderTeamLocationSaveRequest, function (teamProviderInRequest) {
                    if (teamProviderInRequest.provider.id === searchedTeamProvider.provider.entity.id) {
                        searchedTeamProvider.provider.entity.checked = true;
                    }
                });
            });
        };

        /**
         * Method to manipulate check boxes in Client Providers tab
         */
        $scope.setClientProviderSelected = function (providers) {
            angular.forEach(providers, function (provider) {
                if ($scope.teamProviders[provider.provider.entity.id]) {
                    $scope.teamProviders[provider.provider.entity.id].isNewAdd = false;
                    $scope.teamProviders[provider.provider.entity.id].disabled = true;
                    $scope.teamProviders[provider.provider.entity.id].checked = true;
                    $scope.teamProviders[provider.provider.entity.id].associated = true;
                    provider.provider.entity.isNewAdd = false;
                    provider.provider.entity.disabled = true;
                    provider.provider.entity.checked = true;
                }
            });
        };

        var managedClientProviderList = 'clientProviders';
        ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
            $scope.handleResponse(clientProviders, managedClientProviderList);
            $scope.setClientProviderSelected($scope.clientProviders);
        });
        $scope.tabs = TeamProviderService.setAllTabs($scope.addAnother);
        
        function init() {
        	$scope.status = 'ACTIVE_ONLY';
        }
        init();
    })
;
