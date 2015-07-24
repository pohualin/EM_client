'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', ['$scope', '$modal', '$controller', 'Location', 'STATUS', 'SelectAllFactory', 'AddTeamLocationsFactory',
       function ($scope, $modal, $controller, Location, STATUS, SelectAllFactory, AddTeamLocationsFactory) {

        $controller('LocationCommon', {$scope: $scope});
        $controller('CommonSearch', {$scope: $scope});

        var managedLocationList = 'locations';

        /**
         * Set selected locations check box to be checked
         */
        $scope.setSelectedLocations = function (locations) {
        	angular.forEach(locations, function (location) {
                if (AddTeamLocationsFactory.getSelectedLocations()[location.location.entity.id]) {
                    location.location.entity.checked = true;
                    location.location.entity.providersSelected = AddTeamLocationsFactory.getSelectedLocations()[location.location.entity.id].providersSelected;
                } else {
                    location.location.entity.checked = false;
                }
                if(!location.location.entity.providersSelected){
                    location.location.entity.providersSelected =  angular.copy($scope.providersData);
                }
            });
        };

        /**
         * Search on search all location tab
         */
        $scope.search = function (term) {
        	if (term.$valid){
                $scope.loading = true;
                $scope.locations = null;
                $scope.searchAll.status = STATUS.ACTIVE_ONLY;
                Location.findWithoutCL($scope.client, $scope.searchAll.locationQuery, $scope.searchAll.status).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.allLocationsSearch = true;
                }, function () {
                    $scope.loading = false;
                });
            }
        };

        /**
         * Sorting on search all location tab
         */
        $scope.sortTeam = function (property) {
        	$scope.loading = true;
            Location.findWithoutCL($scope.client, $scope.searchAll.locationQuery, $scope.searchAll.status,
                    $scope.createSortProperty(property), $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setSelectedLocations($scope.locations);
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Status change on search all locations tab
         */
        $scope.statusChange = function () {
            $scope.loading = true;
            Location.findWithoutCL($scope.client, $scope.searchAll.locationQuery, $scope.searchAll.status, null, $scope.currentPageSize).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.setSelectedLocations($scope.locations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Fetch pages on search all locations tab
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setSelectedLocations($scope.locations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Called when the check box is checked or unchecked.
         * Add the location to selectedLocation and assign whole list of providers to it when it's checked.
         * Delete location from selectedLocation when it's unchecked.
         */
        $scope.onCheckboxChange = function (locationResource) {
            if (!locationResource.location.entity.checked) {
                delete AddTeamLocationsFactory.getSelectedLocations()[locationResource.location.entity.id];
            } else {
                AddTeamLocationsFactory.getSelectedLocations()[locationResource.location.entity.id] = locationResource.location.entity;
                locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
            }
        };

           /**
         * Add new location button in search all locations tab
         */
        $scope.createNewTeamLocation = function () {
            $scope.$hide();
            $modal({
                scope: $scope,
                template: 'admin-facing/partials/team/location/new.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                backdrop: 'static'
            });
        };

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
        $scope.$on('refreshTeamLocationsSearchPage', function(){
            $scope.locations = null;
            $scope.searchAll = {};
            $scope.allLocationsSearch = false;
            AddTeamLocationsFactory.resetSelectedLocations();
        });

           function init() {
            $scope.locations = null;
            $scope.searchAll = {};
            $scope.allLocationsSearch = false;
            AddTeamLocationsFactory.resetSelectedLocations();
        }
        init();
    }]);
