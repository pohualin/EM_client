'use strict';

angular.module('emmiManager')

    .controller('ClientProvidersTabController', ['$scope', '$controller', 'SelectAllTeamProvidersFactory', 'AddTeamProvidersFactory', 'TeamProviderService', 'ProviderSearch',
         function ($scope, $controller, SelectAllTeamProvidersFactory, AddTeamProvidersFactory, TeamProviderService, ProviderSearch) {

        $controller('CommonSearch', {$scope: $scope});

        var managedClientProviderList = 'clientProviders';
        
        /**
         * Set selected providers check box to be checked
         */
        $scope.setSelectedProviders = function (providers) {
            angular.forEach(providers, function (provider) {
                if (AddTeamProvidersFactory.getSelectedClientProviders()[provider.provider.entity.id]) {
                    provider.provider.entity.checked = true;
                    provider.provider.entity.selectedTeamLocations = 
                        AddTeamProvidersFactory.getSelectedClientProviders()[provider.provider.entity.id].selectedTeamLocations;
                } else {
                    provider.provider.entity.checked = false;
                }
                if(!provider.provider.entity.selectedTeamLocations){
                    provider.provider.entity.selectedTeamLocations =  angular.copy($scope.allTeamLocations);
                }
            });
        };

        /**
         * Called when a column header in client providers result table is clicked.
         */
        $scope.sortClientProviders = function (property) {
            $scope.loading = true;
            TeamProviderService.getPossibleClientProviders($scope.teamResource, $scope.createSortProperty(property)).then(function (clientProviders) {
                $scope.handleResponse(clientProviders, managedClientProviderList);
                $scope.setSelectedProviders($scope.clientProviders);
                if(SelectAllTeamProvidersFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
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
                $scope.handleResponse(providerPage, managedClientProviderList);
                $scope.setSelectedProviders($scope.clientProviders);
                if(SelectAllTeamProvidersFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * Called when the check box is checked or unchecked. 
         * Add the provider to selectedClientProviders and assign whole list of teams to it when it's checked. 
         * Delete provider from selectedClientProviders when it's unchecked.
         */
        $scope.onCheckboxChange = function (providerResource) {
            if(!SelectAllTeamProvidersFactory.isSelectAll()) {
                if (!providerResource.provider.entity.checked) {
                    $scope.removeFromSelectedClientProviders(providerResource);
                } else {
                    $scope.addToSelectedClientProviders(providerResource);
                }
            } else {
                if (!providerResource.provider.entity.checked) {
                    $scope.removeFromSelectedClientProviders(providerResource);
                    $scope.addToExclusionSet(providerResource);
                } else {
                    $scope.removeFromExclusionSet(providerResource);
                    $scope.addToSelectedClientProviders(providerResource);
                }
            }
        };
        
        $scope.addToExclusionSet = function(providerResource) {
            SelectAllTeamProvidersFactory.getExclusionSet()[providerResource.provider.entity.id] = providerResource.provider.entity;
        };
        
        $scope.removeFromExclusionSet = function(providerResource) {
            delete SelectAllTeamProvidersFactory.getExclusionSet()[providerResource.provider.entity.id];
        };
        
        $scope.addToSelectedClientProviders = function(providerResource) {
            AddTeamProvidersFactory.getSelectedClientProviders()[providerResource.provider.entity.id] = providerResource.provider.entity;
            providerResource.provider.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
            SelectAllTeamProvidersFactory.getSelectedPossibleProviderIds()[providerResource.provider.entity.id] = providerResource.provider.entity.id;
        };
        
        $scope.removeFromSelectedClientProviders = function(providerResource) {
            delete AddTeamProvidersFactory.getSelectedClientProviders()[providerResource.provider.entity.id];
            delete SelectAllTeamProvidersFactory.getSelectedPossibleProviderIds()[providerResource.provider.entity.id];
        };
        
        $scope.setPossibleProviders = function() {
            TeamProviderService.getPossibleClientProviders($scope.teamResource).then(function (clientProviders) {
                $scope.handleResponse(clientProviders, managedClientProviderList);
                TeamProviderService.getTeamProvidersCount($scope.teamResource).then(function(count){
                    SelectAllTeamProvidersFactory.setTotalPossibleProvidersCount(clientProviders.page.totalElements - count);
                });
            });
        };
        
        /**
         * Listen on 'selectAllChecked' event
         * 
         * When the provider meets all the following conditions
         * a. Have not been associated.
         * b. Has not been added to selectedClientProviders.
         * c. Is not excluded.
         * 
         * Then check the check box on the provider and call onCheckboxChange
         */
        $scope.$on('selectAllChecked', function () {
            angular.forEach($scope.clientProviders, function(clientProvider){
                if(!clientProvider.link.self && 
                        !AddTeamProvidersFactory.getSelectedClientProviders()[clientProvider.provider.entity.id] && 
                        !SelectAllTeamProvidersFactory.getExclusionSet()[clientProvider.provider.entity.id]){
                    clientProvider.provider.entity.checked = true;
                    $scope.onCheckboxChange(clientProvider);
                }
            });
        });

        /**
         * Listen on 'selectAllUnchecked' event
         * 
         * Reset selectedClientProviders
         * Reset exclusioSet
         * Uncheck all checked check boxes in the page
         */
        $scope.$on('selectAllUnchecked', function () {
            AddTeamProvidersFactory.resetSelectedClientProviders();
            SelectAllTeamProvidersFactory.resetSelectedPossibleProviderIds();
            SelectAllTeamProvidersFactory.resetExclusionSet();
            $scope.setSelectedProviders($scope.clientProviders);
        });
        
        /**
         * Listen on 'setTeamLocations' event
         */
        $scope.$on('setTeamLocations', function(){
            $scope.allTeamLocations = TeamProviderService.buildMultiSelectData(AddTeamProvidersFactory.getTeamLocations());
        });
        
        /**
         * Listen on 'refreshClientProvidersPage' event
         */
        $scope.$on('refreshClientProvidersPage', function(){
            $scope.clientProviders = null;
            SelectAllTeamProvidersFactory.setSelectAll(false);
            AddTeamProvidersFactory.resetSelectedClientProviders();
            $scope.setPossibleProviders();
        });

        function init() {
            $scope.clientProviders = null;
            $scope.setPossibleProviders()
        }
        init();
    }])