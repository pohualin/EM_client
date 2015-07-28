'use strict';

angular.module('emmiManager')

    .controller('AddTeamsProvidersController', ['$scope', 'TeamLocation', 'TeamProviderService', 'focus', 'SelectAllTeamProvidersFactory', 'AddTeamProvidersService', 'AddTeamProvidersFactory',
        function ($scope, TeamLocation, TeamProviderService, focus, SelectAllTeamProvidersFactory, AddTeamProvidersService, AddTeamProvidersFactory) {

        $scope.tabs = AddTeamProvidersService.setAllTabs();

        /**
         * Return true if any provider is selected or SelectAllTeamProvidersFactory.isSelectAll() returns true
         */
        $scope.hasProvidersAdded = function() {
            // Any provider selected or select all is checked
            return SelectAllTeamProvidersFactory.isSelectAll() || !angular.equals({}, AddTeamProvidersFactory.getSelectedClientProviders()) || !angular.equals({}, AddTeamProvidersFactory.getSelectedProviders());
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
