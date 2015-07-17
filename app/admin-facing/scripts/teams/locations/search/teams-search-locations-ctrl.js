'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', ['$rootScope', '$scope', '$q', '$modal', '$controller', 'TeamSearchLocation', 'Location', 'Client', 'ProviderView', 'TeamProviderService', 'focus', 'STATUS',
       function ($rootScope, $scope, $q, $modal, $controller,TeamSearchLocation, Location, Client, ProviderView, TeamProviderService, focus, STATUS) {

        $controller('LocationCommon', {$scope: $scope});
        $controller('CommonSearch', {$scope: $scope});

        $scope.selectedLocations = {};
        $scope.searchAll = {};
        var managedLocationList = 'locations';
        var managedClientLocationList = 'clientLocations';

        /**
         * Return true if any location is selected
         */
        $scope.hasLocationsAdded = function() {
            if(angular.equals({}, $scope.selectedLocations)){
                return false;
            } else {
                return true;
            }
        };

        /**
         * Set existing TeamLocation check boxes to be checked and disabled.
         */
        $scope.setExistingClientTeamLocation = function (locations) {
            angular.forEach( locations , function (location) {
            	if ($scope.teamLocations[location.location.entity.id]) {
                    location.location.entity.disabled = true;
                    location.location.entity.checked = true;
                }
                //location.location.entity.providers = angular.copy(providersData);
                location.location.entity.providersSelected = angular.copy($scope.providersData);
            });
        };

        $scope.cleanSearch = function() {
        	$scope.allLocationsSearch = false;
            $scope.locations = null;
            $scope.selectedLocations = {};
            $scope.searchAll.locationQuery = null;
        };

        /**
         * Save selected locations
         */
        $scope.savePopupLocations = function(addAnother) {
            $scope.whenSaving = true;
            var deferred = $q.defer();
        	var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest($scope.selectedLocations, $scope.providersData);
            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // close the modal and show the message
                if (!addAnother) {
                    $scope.$hide();
                    $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                }
                // refresh the parent scope locations in the background
                $scope.refresh();
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
                deferred.resolve(locationsToAdd);
            }).finally(function () {
                $scope.whenSaving = false;
            });
            return deferred.promise;
        };

        /**
         * Save and add another button on client locations tab. User wants to be taken 
         * to Search all locations tab after selected locations been added.
         */
        $scope.saveAndAddAnother = function () {
            $scope.savePopupLocations(true).then(function (locationsToAdd) {
                // set the active tab to search per UAT ticket EM-1029
                $scope.tabs.activeTab = 1;
                $scope.cleanSearch();
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                focus('LocationSearchFocus');
            });
        };

        /**
         * Hide model when cancel button is hit
         */
        $scope.hidePopupLocations = function () {
            $scope.$hide();
        };

        /**
         * Set selected locations check box to be checked
         */
        $scope.setSelectedLocations = function (locations) {
        	angular.forEach(locations, function (location) {
                if ($scope.selectedLocations[location.location.entity.id]) {
                    location.location.entity.checked = true;
                    location.location.entity.providersSelected = $scope.selectedLocations[location.location.entity.id].providersSelected;
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
                Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.searchAll.status).then(function (locationPage) {
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
            Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.searchAll.status, 
                    $scope.createSortProperty(property), $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setSelectedLocations($scope.locations);
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Sorting on Client Locations tab
         */
        $scope.sortClient = function (property) {
            $scope.loading = true;
            Location.findForClient(Client.getClient(), $scope.currentPageSize, $scope.createSortProperty(property)).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setExistingClientTeamLocation($scope.clientLocations);
                $scope.setSelectedLocations($scope.clientLocations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Status change on search all locations tab
         */
        $scope.statusChange = function () {
            $scope.loading = true;
            Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.searchAll.status, null, $scope.currentPageSize).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.setSelectedLocations($scope.locations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Fetching pages on Search all locations tab
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
         * Fetching pages on Client Locations tab
         */
        $scope.fetchPageClientLocations = function (href){
        	$scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setExistingClientTeamLocation($scope.clientLocations);
                $scope.setSelectedLocations($scope.clientLocations);
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
            if (!locationResource.location.entity.checked) {
                delete $scope.selectedLocations[locationResource.location.entity.id];
            } else {
                $scope.selectedLocations[locationResource.location.entity.id] = locationResource.location.entity;
                locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
            }
        };

        /**
         * Add new location button in search all locations tab
         */
        $scope.createNewTeamLocation = function () {
            $scope.$hide();
            $modal({scope: $scope, template: 'admin-facing/partials/team/location/new.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
        };

        /**
         * Modal init
         */
        function init() {
        	TeamProviderService.buildMultiSelectProvidersData($scope.teamResource).then(function(response){
            	$scope.providersData = response;
            	$scope.sizeClass =  $scope.providersData.length === 0 ? 'sort col-sm-4' : 'sort col-sm-3';
                Location.findForClient(Client.getClient()).then(function (allLocations) {
                    $scope.handleResponse(allLocations, managedClientLocationList);
                    $scope.setExistingClientTeamLocation($scope.clientLocations);
                });
        	});
        	$scope.cleanSearch();
        	$scope.tabs = TeamSearchLocation.setAllTabs();
        	window.paul = $scope;
        }
        init();

    }])
;
