'use strict';
angular.module('emmiManager')

    .controller('ProviderSearchController', ['$scope', '$controller', '$modal', 'arrays', 'focus', 'ProviderSearch', 'ClientProviderService', 'Client', 'TeamProviderService', 'STATUS', 'AddTeamProvidersFactory',
         function ($scope, $controller, $modal, arrays, focus, ProviderSearch, ClientProviderService, Client, TeamProviderService, STATUS, AddTeamProvidersFactory) {

        $controller('CommonSearch', {$scope: $scope});

        var managedProvidersList = 'providers';

        $scope.setSelectedProviders = function (providers) {
            angular.forEach(providers, function (provider) {
                if (AddTeamProvidersFactory.getSelectedProviders()[provider.provider.entity.id]) {
                    provider.provider.entity.checked = true;
                    provider.provider.entity.selectedTeamLocations = 
                        AddTeamProvidersFactory.getSelectedProviders()[provider.provider.entity.id].selectedTeamLocations;
                } else {
                    provider.provider.entity.checked = false;
                }
                if(!provider.provider.entity.selectedTeamLocations){
                    provider.provider.entity.selectedTeamLocations =  angular.copy($scope.allTeamLocations);
                }
            });
        };
        
        /**
         * Called when search button is clicked from search all provider tab
         */
        $scope.search = function (isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.providers = null;
                $scope.searchAll.status = STATUS.ACTIVE_ONLY;
                ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.searchAll.providerQuery, $scope.searchAll.status)
                .then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProvidersList);
                    $scope.allProvidersSearch = true;
                }, function(){
                    $scope.loading = false;
                });
            }
        };

        /**
         * Called when status changed
         */
        $scope.statusChange = function () {
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.searchAll.providerQuery, $scope.searchAll.status)
                .then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProvidersList);
                    $scope.setSelectedProviders($scope.providers);
                }, function () {
                    $scope.loading = false;
                });
        };

        /**
         * Called to fetch another page of possible providers by given href
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, managedProvidersList);
                $scope.setSelectedProviders($scope.providers);
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Called when a column header in search all provider result table is clicked.
         */
        $scope.sort = function (property) {
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), 
                    $scope.searchAll.providerQuery, $scope.searchAll.status, $scope.createSortProperty(property))
                .then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProvidersList);
                    $scope.setSelectedProviders($scope.providers);
                }, function () {
                    $scope.loading = false;
                });
        };
        
        /**
         * Called when the check box is checked or unchecked.
         * Add the location to selectedLocation and assign whole list of providers to it when it's checked.
         * Delete location from selectedLocation when it's unchecked.
         */
        $scope.onCheckboxChange = function (providerResource) {
            if (!providerResource.provider.entity.checked) {
                delete AddTeamProvidersFactory.getSelectedProviders()[providerResource.provider.entity.id];
            } else {
                AddTeamProvidersFactory.getSelectedProviders()[providerResource.provider.entity.id] = providerResource.provider.entity;
                providerResource.provider.entity.selectedTeamLocations =  angular.copy($scope.allTeamLocations);
            }
        };
        
        /**
         * Add new provider button in search all providers tab
         */
        $scope.createNewProvider = function () {
            $scope.$hide();
            $modal({
                scope: $scope,
                template: 'admin-facing/partials/team/provider/new.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                backdrop: 'static'
            });
        };

        /**
         * Listen on 'setTeamLocations' event
         */
        $scope.$on('setTeamLocations', function(){
            $scope.allTeamLocations = AddTeamProvidersFactory.getTeamLocations();
        });
        
        $scope.$on('refreshTeamProvidersSearchPage', function(){
            $scope.providers = null;
            $scope.searchAll = {};
            $scope.allProvidersSearch = false;
            AddTeamProvidersFactory.resetSelectedProviders();
        });

        function init() {
            $scope.providers = null;
            $scope.searchAll = {};
            $scope.allProvidersSearch = false;
            AddTeamProvidersFactory.resetSelectedProviders();
            focus('ProviderSearchFocus');
        }
        init();
    }])
;
