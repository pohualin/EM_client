'use strict';

angular.module('emmiManager')

    .controller('AddTeamsLocationsController', ['$rootScope', '$scope', 'TeamSearchLocation', 'TeamProviderService', 'SelectAllTeamLocationsFactory', 'AddTeamLocationsService', 'AddTeamLocationsFactory', 'ClientTeamSchedulingConfigurationService',
       function ($rootScope, $scope, TeamSearchLocation, TeamProviderService, SelectAllTeamLocationsFactory, AddTeamLocationsService, AddTeamLocationsFactory, ClientTeamSchedulingConfigurationService) {
        
        $scope.tabs = AddTeamLocationsService.setAllTabs($scope.activeTab);
        
        /**
         * Get TeamProviders for the team, set it to AddTeamLocationsFactory and broadcast 'setTeamProviders' event
         */
        ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function(schedulingConfig){
            if (schedulingConfig.entity.useProvider) {
                TeamProviderService.buildMultiSelectProvidersData($scope.teamResource).then(function(response){
                    AddTeamLocationsFactory.setTeamProviders(response);
                    $scope.$broadcast('setTeamProviders');
                });
            } else {
                AddTeamLocationsFactory.setTeamProviders([]);
                $scope.$broadcast('setTeamProviders');
            }
        });
        
        /**
         * Return true if any location is selected or SelectAllTeamLocationsFactory.isSelectAll() returns true
         */
        $scope.hasLocationsAdded = function() {
            // Any location selected or select all is checked
            return SelectAllTeamLocationsFactory.isSelectAll() || !angular.equals({}, AddTeamLocationsFactory.getSelectedClientLocations()) || !angular.equals({}, AddTeamLocationsFactory.getSelectedLocations());
        };
        
        /**
         * Save selected locations when selectAll is false
         */
        $scope.save = function() {
            $scope.whenSaving = true;
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());    
            var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest(locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders());
            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // close the modal and show the message
                $scope.$hide();
                $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.$broadcast('refreshClientLocationsPage');
                $scope.$broadcast('refreshTeamLocationsSearchPage');
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };

        /**
         * Save and add another when selectAll is false
         * 
         * Save and add another button on client locations tab. User wants to be taken 
         * to Search all locations tab after selected locations been added.
         */
        $scope.saveAndAddAnother = function () {
            $scope.whenSaving = true;
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest(locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders());
            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.tabs.activeTab = 1;
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                focus('LocationSearchFocus');
                $scope.$broadcast('refreshClientLocationsPage');
                $scope.$broadcast('refreshTeamLocationsSearchPage');
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };

        /**
         * Save when selectAll is true
         */
        $scope.saveAll = function () {
            $scope.whenSaving = true;
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            TeamSearchLocation.saveAllLocationsExcept($scope.teamClientResource.teamResource, 
                    locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders(), SelectAllTeamLocationsFactory.getExclusionSet())
                .then(function (locationsToAdd) {
                // close the modal and show the message
                $scope.$hide();
                $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.$broadcast('refreshClientLocationsPage');
                $scope.$broadcast('refreshTeamLocationsSearchPage');
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };
        
        /**
         * Save and add another when selectAll is true
         */
        $scope.saveAllAndAddAnother = function () {
            $scope.whenSaving = true;
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            TeamSearchLocation.saveAllLocationsExcept($scope.teamClientResource.teamResource, 
                    locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders(), SelectAllTeamLocationsFactory.getExclusionSet())
                .then(function (locationsToAdd) {
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.tabs.activeTab = 1;
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                focus('LocationSearchFocus');
                $scope.$broadcast('refreshClientLocationsPage');
                $scope.$broadcast('refreshTeamLocationsSearchPage');
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };
        
        /**
         * Set $scope.selectAll whenever SelectAllTeamLocationsFactory.isSelectAll changed
         */
        $scope.$watch(
            function() {
                return SelectAllTeamLocationsFactory.isSelectAll();
            }, function(newValue) {
                $scope.selectAll = newValue;
            }
        );
        
        /**
         * Hide model when cancel button is hit
         */
        $scope.hidePopupLocations = function () {
            $scope.$hide();
        };
        
    }]);
