'use strict';

angular.module('emmiManager')

    .controller('AddTeamsProvidersController', ['$scope', 'focus', 'TeamLocation', 'TeamProviderService', 'ProviderSearch', 'SelectAllTeamProvidersFactory', 'AddTeamProvidersService', 'AddTeamProvidersFactory', 'ClientTeamSchedulingConfigurationService',
        function ($scope, focus, TeamLocation, TeamProviderService, ProviderSearch, SelectAllTeamProvidersFactory, AddTeamProvidersService, AddTeamProvidersFactory, ClientTeamSchedulingConfigurationService) {

        $scope.tabs = AddTeamProvidersService.setAllTabs($scope.activeTab);

        /**
         * Get TeamLocations for the provider, set it to AddTeamProvidersFactory and broadcast 'setTeamLocations' event
         */
        ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function(schedulingConfig){
            if (schedulingConfig.entity.useLocation) {
                TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function (response) {
                    AddTeamProvidersFactory.setTeamLocations(response);
                    $scope.$broadcast('setTeamLocations');
                });
            } else {
                AddTeamProvidersFactory.setTeamLocations([]);
                $scope.$broadcast('setTeamLocations');
            }
        });
        
        /**
         * Return true if any provider is selected or SelectAllTeamProvidersFactory.isSelectAll() returns true
         */
        $scope.hasProvidersAdded = function() {
            // Any provider is selected or select all is checked
            return SelectAllTeamProvidersFactory.isSelectAll() || !angular.equals({}, AddTeamProvidersFactory.getSelectedClientProviders()) || !angular.equals({}, AddTeamProvidersFactory.getSelectedProviders());
        };

        /**
         * Save method to call when selectAll is false
         */
        $scope.save = function () {
            $scope.associateRequestSubmitted = true;
            var providersAcrossTabs = angular.extend({}, AddTeamProvidersFactory.getSelectedClientProviders(), AddTeamProvidersFactory.getSelectedProviders());    
            ProviderSearch.isSaveRequestValid(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs).then(function(valid){
                if(valid){
                    $scope.whenSaving = true;
                    var providersToAdd = ProviderSearch.getTeamProviderTeamLocationSaveRequest(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs);
                    ProviderSearch
                        .updateProviderTeamAssociations(providersToAdd, $scope.teamResource)
                        .then(function () {
                            $scope.successAlert(providersToAdd, '#messages-container');
                            $scope.hideAddProvidersModal();
                            $scope.refreshLocationsAndProviders();
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
        
        /**
         * SaveAndAnother method to call when selectAll is false
         */
        $scope.saveAndAddAnother = function () {
            $scope.associateRequestSubmitted = true;
            var providersAcrossTabs = angular.extend({}, AddTeamProvidersFactory.getSelectedClientProviders(), AddTeamProvidersFactory.getSelectedProviders());    
            ProviderSearch.isSaveRequestValid(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs).then(function(valid){
                if(valid){
                    $scope.whenSaving = true;
                    var providersToAdd = ProviderSearch.getTeamProviderTeamLocationSaveRequest(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs);
                    ProviderSearch
                        .updateProviderTeamAssociations(providersToAdd, $scope.teamResource)
                        .then(function () {
                            $scope.refreshLocationsAndProviders();
                            $scope.tabs.activeTab = 1;
                            $scope.successAlert(providersToAdd, '#modal-messages-container');
                            $scope.$broadcast('refreshClientProvidersPage');
                            $scope.$broadcast('refreshTeamProvidersSearchPage');
                            focus('ProviderSearchFocus');
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
        
        /**
         * Save method to call when selectAll is true
         */
        $scope.saveAll = function () {
            $scope.associateRequestSubmitted = true;
            var providersAcrossTabs = angular.extend({}, AddTeamProvidersFactory.getSelectedClientProviders(), AddTeamProvidersFactory.getSelectedProviders());    
            ProviderSearch.isSaveRequestValid(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs).then(function(valid){
                if(valid){
                    $scope.whenSaving = true;
                    ProviderSearch
                        .saveAllProvidersExcept($scope.teamResource, providersAcrossTabs, 
                                AddTeamProvidersFactory.getTeamLocations(), SelectAllTeamProvidersFactory.getExclusionSet())
                        .then(function (providersToAdd) {
                            $scope.successAlert(providersToAdd, '#messages-container');
                            $scope.hideAddProvidersModal();
                            $scope.refreshLocationsAndProviders();
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
      
        /**
         * SaveAndAddAnother method to call when selectAll is true
         */
        $scope.saveAllAndAddAnother = function () {
            $scope.associateRequestSubmitted = true;
            var providersAcrossTabs = angular.extend({}, AddTeamProvidersFactory.getSelectedClientProviders(), AddTeamProvidersFactory.getSelectedProviders());    
            ProviderSearch.isSaveRequestValid(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs).then(function(valid){
                if(valid){
                    $scope.whenSaving = true;
                    ProviderSearch
                        .saveAllProvidersExcept($scope.teamResource, providersAcrossTabs, 
                                AddTeamProvidersFactory.getTeamLocations(), SelectAllTeamProvidersFactory.getExclusionSet())
                        .then(function (providersToAdd) {
                            $scope.refreshLocationsAndProviders();
                            $scope.tabs.activeTab = 1;
                            $scope.successAlert(providersToAdd, '#modal-messages-container');
                            $scope.$broadcast('refreshClientProvidersPage');
                            $scope.$broadcast('refreshTeamProvidersSearchPage');
                            focus('ProviderSearchFocus');
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
        
        /**
         * Hide model when cancel button is hit. Also reset selectedClientProviders and selectedProviders
         */
        $scope.hideAddProvidersModal = function () {
            $scope.$hide();
            AddTeamProvidersFactory.resetSelectedClientProviders();
            AddTeamProvidersFactory.resetSelectedProviders();
        };
        
        /**
         * Set $scope.selectAll whenever SelectAllTeamProvidersFactory.isSelectAll changed
         */
        $scope.$watch(
            function() {
                return SelectAllTeamProvidersFactory.isSelectAll();
            }, function(newValue) {
                $scope.selectAll = newValue;
            }
        );
    }]);
