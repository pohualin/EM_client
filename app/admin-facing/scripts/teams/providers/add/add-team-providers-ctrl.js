'use strict';

angular.module('emmiManager')

    .controller('AddTeamsProvidersController', ['$scope', 'TeamLocation', 'TeamProviderService', 'focus', 'ProviderSearch', 'SelectAllTeamProvidersFactory', 'AddTeamProvidersService', 'AddTeamProvidersFactory',
        function ($scope, TeamLocation, TeamProviderService, focus, ProviderSearch, SelectAllTeamProvidersFactory, AddTeamProvidersService, AddTeamProvidersFactory) {

        $scope.tabs = AddTeamProvidersService.setAllTabs();

        /**
         * Return true if any provider is selected or SelectAllTeamProvidersFactory.isSelectAll() returns true
         */
        $scope.hasProvidersAdded = function() {
            // Any provider selected or select all is checked
            return SelectAllTeamProvidersFactory.isSelectAll() || !angular.equals({}, AddTeamProvidersFactory.getSelectedClientProviders()) || !angular.equals({}, AddTeamProvidersFactory.getSelectedProviders());
        };
        
        $scope.saveAssociationAndAddAnotherProvider = function () {
            $scope.associateSelectedProvidersToTeam(true).then(function (providersToAdd) {
                $scope.refreshLocationsAndProviders().then(function () {
                    $scope.successAlert(providersToAdd, '#modal-messages-container');
                    $scope.resetState();
                    // if on the client providers tab
                    if ($scope.tabs.activeTab === 0) {
                        // disable previously selected providers
                        $scope.setClientProviderSelected($scope.clientProviders);
                    }
                    // set the active tab to search per UAT ticket EM-1029
                    $scope.tabs.activeTab = 1;
                    $scope.cleanSearch();
                    focus('ProviderSearchFocus');
                });
            });
        };

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
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
        
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
        
        $scope.saveAllAndAddAnother = function () {
            $scope.associateRequestSubmitted = true;
            var providersAcrossTabs = angular.extend({}, AddTeamProvidersFactory.getSelectedClientProviders(), AddTeamProvidersFactory.getSelectedProviders());    
            ProviderSearch.isSaveRequestValid(AddTeamProvidersFactory.getTeamLocations(), providersAcrossTabs).then(function(valid){
                if(valid){
                    $scope.whenSaving = true;
                    ProviderSearch
                        .saveAllProvidersExcept($scope.teamResource, providersAcrossTabs, 
                                AddTeamProvidersFactory.getTeamLocations(), SelectAllTeamProvidersFactory.getExclusionSet())
                        .then(function () {
                            $scope.refreshLocationsAndProviders();
                            $scope.tabs.activeTab = 1;
                            $scope.successAlert(providersToAdd, '#modal-messages-container');
                            $scope.$broadcast('refreshClientProvidersPage');
                            $scope.$broadcast('refreshTeamProvidersSearchPage');
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            });
        };
        
        /**
         * Hide model when cancel button is hit
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
        
        /**
         * Get TeamLocations for the provider, set it to AddTeamProvidersFactory and broadcast 'setTeamLocations' event
         */
        TeamLocation.getTeamLocations($scope.teamResource.link.teamLocations).then(function (response) {
            AddTeamProvidersFactory.setTeamLocations(response);
            $scope.$broadcast('setTeamLocations');
        });
    }]);
