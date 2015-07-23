'use strict';

angular.module('emmiManager')

    .controller('AddTeamsLocationsController', ['$rootScope', '$scope', 'TeamSearchLocation', 'TeamProviderService', 'SelectAllFactory', 'AddTeamLocationsService', 'AddTeamLocationsFactory',
       function ($rootScope, $scope, TeamSearchLocation, TeamProviderService, SelectAllFactory, AddTeamLocationsService, AddTeamLocationsFactory) {
        
        $scope.tabs = AddTeamLocationsService.setAllTabs();

        /**
         * Get TeamProviders for the team, set it to AddTeamLocationsFactory and broadcast 'setTeamProviders' event
         */
        TeamProviderService.buildMultiSelectProvidersData($scope.teamResource).then(function(response){
            AddTeamLocationsFactory.setTeamProviders(response);
            $scope.$broadcast('setTeamProviders');
        });
        
        /**
         * Return true if any location is selected or SelectAllFactory.isSelectAll() returns true
         */
        $scope.hasLocationsAdded = function() {
            // Any location selected or select all is checked
            return SelectAllFactory.isSelectAll() 
                || !angular.equals({}, AddTeamLocationsFactory.getSelectedClientLocations())
                || !angular.equals({}, AddTeamLocationsFactory.getSelectedLocations());
        };
        
        /**
         * Save selected locations when selectAll is false
         */
        $scope.save = function(addAnother) {
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());    
            var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest(locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders());
            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // close the modal and show the message
                $scope.$hide();
                $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                // refresh the parent scope locations in the background
                $scope.refresh();
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
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest(locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders());
            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.tabs.activeTab = 1;
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                focus('LocationSearchFocus');
                $scope.$broadcast("refreshClientLocationsPage");
                $scope.$broadcast("refreshTeamLocationsSearchPage");
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };

        /**
         * Save when selectAll is true
         */
        $scope.saveAll = function () {
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            TeamSearchLocation.saveAllLocationsExcept($scope.teamClientResource.teamResource, 
                    locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders(), SelectAllFactory.getExclusionSet())
                .then(function (locationsToAdd) {
                // close the modal and show the message
                $scope.$hide();
                $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                // refresh the parent scope locations in the background
                $scope.refresh();
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };
        
        /**
         * Save and add another when selectAll is true
         */
        $scope.saveAllAndAddAnother = function () {
            var locationsAcrossTabs = angular.extend({}, AddTeamLocationsFactory.getSelectedClientLocations(), AddTeamLocationsFactory.getSelectedLocations());
            TeamSearchLocation.saveAllLocationsExcept($scope.teamClientResource.teamResource, 
                    locationsAcrossTabs, AddTeamLocationsFactory.getTeamProviders(), SelectAllFactory.getExclusionSet())
                .then(function (locationsToAdd) {
                // refresh the parent scope locations in the background
                $scope.refresh();
                $scope.tabs.activeTab = 1;
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                focus('LocationSearchFocus');
                $scope.$broadcast("refreshClientLocationsPage");
                $scope.$broadcast("refreshTeamLocationsSearchPage");
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };
        
        /**
         * Set $scope.selectAll whenever SelectAllFactory.isSelectAll changed
         */
        $scope.$watch(
            function() {
                return SelectAllFactory.isSelectAll();
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
