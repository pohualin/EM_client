'use strict';

angular.module('emmiManager')

    .controller('ClientLocationsTabController', ['$scope', '$controller', 'TeamSearchLocation', 'Location', 'TeamProviderService', 'TeamLocation', 'SelectAllFactory', 'AddTeamLocationsFactory',
       function ($scope, $controller,TeamSearchLocation, Location, TeamProviderService, TeamLocation, SelectAllFactory, AddTeamLocationsFactory) {

        $controller('LocationCommon', {$scope: $scope});
        $controller('CommonSearch', {$scope: $scope});

        var managedClientLocationList = 'teamLocations';

        /**
         * Set selected locations check box to be checked
         */
        $scope.setSelectedLocations = function (locations) {
            angular.forEach(locations, function (location) {
                if (AddTeamLocationsFactory.getSelectedClientLocations()[location.location.entity.id]) {
                    location.location.entity.checked = true;
                    location.location.entity.providersSelected = 
                        AddTeamLocationsFactory.getSelectedClientLocations()[location.location.entity.id].providersSelected;
                } else {
                    location.location.entity.checked = false;
                }
                if(!location.location.entity.providersSelected){
                    location.location.entity.providersSelected =  angular.copy($scope.providersData);
                }
            });
        };

        /**
         * Sorting on Client Locations tab
         */
        $scope.sortClient = function (property) {
            $scope.loading = true;
            TeamLocation.getPossibleClientLocations($scope.teamResource, $scope.createSortProperty(property)).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setSelectedLocations($scope.teamLocations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Fetching pages on Client Locations tab
         */
        $scope.fetchPageClientLocations = function (href){
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setSelectedLocations($scope.teamLocations);
                if(SelectAllFactory.isSelectAll()){
                    $scope.$emit('selectAllChecked');
                }
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Called when the check box is checked or unchecked. 
         * Add the location to selectedLocation and assign whole list of providers to it when it's checked. 
         * Delete location from selectedLocation when it's unchecked.
         */
        $scope.onCheckboxChange = function (locationResource) {
            if(!SelectAllFactory.isSelectAll()) {
                if (!locationResource.location.entity.checked) {
                    $scope.removeFromSelectedLocations(locationResource);
                } else {
                    $scope.addToSelectedLocations(locationResource)
                }
            } else {
                if (!locationResource.location.entity.checked) {
                    $scope.removeFromSelectedLocations(locationResource);
                    $scope.addToExclusionSet(locationResource);
                } else {
                    $scope.removeFromExclusionSet(locationResource);
                    $scope.addToSelectedLocations(locationResource);
                }
            }
        };
        
        $scope.addToExclusionSet = function(locationResource) {
            SelectAllFactory.getExclusionSet()[locationResource.location.entity.id] = locationResource.location.entity;
        };
        
        $scope.removeFromExclusionSet = function(locationResource) {
            delete SelectAllFactory.getExclusionSet()[locationResource.location.entity.id];
        };
        
        $scope.addToSelectedLocations = function(locationResource) {
            AddTeamLocationsFactory.getSelectedClientLocations()[locationResource.location.entity.id] = locationResource.location.entity;
            locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
            SelectAllFactory.getSelectedPossibleLocationIds()[locationResource.location.entity.id] = locationResource.location.entity.id;
        };
        
        $scope.removeFromSelectedLocations = function(locationResource) {
            delete AddTeamLocationsFactory.getSelectedClientLocations()[locationResource.location.entity.id];
            delete SelectAllFactory.getSelectedPossibleLocationIds()[locationResource.location.entity.id];
        };
        
        $scope.setPossibleLocations = function() {
            TeamLocation.getPossibleClientLocations($scope.teamResource).then(function (allLocations) {
                $scope.handleResponse(allLocations, managedClientLocationList);
                TeamLocation.getTeamLocationsCount($scope.teamResource).then(function(count){
                    SelectAllFactory.setTotalPossibleLocationsCount(allLocations.page.totalElements - count);
                });
            });
        };
        
        /**
         * Listen on 'selectAllChecked' event
         * 
         * When the location meets all the following conditions
         * a. Have not been associated.
         * b. Has not been added to selectedClientLocations.
         * c. Is not excluded.
         * 
         * Then check the check box on the location and call onCheckboxChange
         */
        $scope.$on('selectAllChecked', function () {
            angular.forEach($scope.teamLocations, function(teamLocation){
                if(!teamLocation.link.self && 
                        !AddTeamLocationsFactory.getSelectedClientLocations()[teamLocation.location.entity.id] && 
                        !SelectAllFactory.getExclusionSet()[teamLocation.location.entity.id]){
                    teamLocation.location.entity.checked = true;
                    $scope.onCheckboxChange(teamLocation);
                }
            });
        });
        
        /**
         * Listen on 'selectAllUnchecked' event
         * 
         * Reset selectedClientLocations
         * Reset exclusioSet
         * Uncheck all checked check boxes in the page
         */
        $scope.$on('selectAllUnchecked', function () {
            AddTeamLocationsFactory.resetSelectedClientLocations();
            SelectAllFactory.resetSelectedPossibleLocationIds();
            SelectAllFactory.resetExclusionSet();
            $scope.setSelectedLocations($scope.teamLocations);
        });
        
        /**
         * Listen on 'setTeamProviders' event
         */
        $scope.$on('setTeamProviders', function(){
            $scope.providersData = AddTeamLocationsFactory.getTeamProviders();
            $scope.sizeClass = AddTeamLocationsFactory.getTeamProviders().length === 0 ? 'sort col-sm-4' : 'sort col-sm-3';
        });
        
        /**
         * Listen on 'refreshClientLocationsPage' event
         */
        $scope.$on('refreshClientLocationsPage', function(){
            $scope.teamLocations = null;
            AddTeamLocationsFactory.resetSelectedClientLocations();
            $scope.setPossibleLocations();
        });
        
        function init() {
            $scope.teamLocations = null;
        	$scope.setPossibleLocations();
        }
        init();
        window.clientLocationsTab = $scope;
    }])
;
