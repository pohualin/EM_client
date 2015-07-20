'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', ['$rootScope', '$scope', '$q', '$modal', '$controller', 'TeamSearchLocation', 'Location', 'Client', 'ProviderView', 'TeamProviderService', 'focus', 'STATUS', 'TeamLocation',
       function ($rootScope, $scope, $q, $modal, $controller,TeamSearchLocation, Location, Client, ProviderView, TeamProviderService, focus, STATUS, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});
        $controller('CommonSearch', {$scope: $scope});

        $scope.selectedLocations = {};
        $scope.selectAllBut = {};
        $scope.searchAll = {};
        var managedLocationList = 'locations';
        var managedClientLocationList = 'teamLocations';

        /**
         * Return true if any location is selected or selectAllClientTeams is true
         */
        $scope.hasLocationsAdded = function() {
            // Any location selected or select all is checked
            return !angular.equals({}, $scope.selectedLocations) || $scope.selectAllClientTeams;
        };
        
        /**
         * When select all check box is checked/unchecked, turn selectAllClientTeam to true/false.
         * Fire 'selectAllButSome' event to check all unchecked check boxes on this page
         * 
         */
        $scope.selectAllClientTeamsChanged = function(){
            $scope.selectAllClientTeams = $scope.selectAllClientTeams ? false : true;
            $scope.$emit('selectAllButSome');
        };
        
        /**
         * On 'selectAllButSome' events happens
         * Select all locations on the page that have not associated yet except those unchecked when selectAllClientTeams is true. 
         * Clear all selections when selectAllClientTeams is false.
         * 
         */
        $scope.$on('selectAllButSome', function () {
            if($scope.selectAllClientTeams){
                angular.forEach($scope.teamLocations, function(teamLocation){
                    // When the location have not been associated.
                    // and
                    // When the location has not been added to selectedLocations.
                    // and
                    // When location is not unchecked.
                    if(!teamLocation.link.self && 
                            !$scope.selectedLocations[teamLocation.location.entity.id] && 
                            !$scope.selectAllBut[teamLocation.location.entity.id]){
                        $scope.selectedLocations[teamLocation.location.entity.id] = teamLocation.location.entity;
                        teamLocation.location.entity.providersSelected =  angular.copy($scope.providersData);
                        teamLocation.location.entity.checked = true;
                    }
                });
            } else {
                $scope.selectedLocations = {};
                $scope.selectAllBut = {};
                angular.forEach($scope.teamLocations, function(teamLocation){
                    if(!teamLocation.link.self){
                        teamLocation.location.entity.checked = false;
                    }
                });
            }
        });
        
        $scope.cleanSearch = function() {
        	$scope.allLocationsSearch = false;
            $scope.locations = null;
            $scope.selectedLocations = {};
            $scope.selectAllBut = {};
            $scope.searchAll.locationQuery = null;
        };

        /**
         * Save selected locations
         */
        $scope.savePopupLocations = function(addAnother) {
            $scope.whenSaving = true;
            var deferred = $q.defer();
            
            if(!$scope.selectAllClientTeams) {
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
            } else {
                TeamSearchLocation.saveAllLocationsExcept($scope.teamClientResource.teamResource, 
                        $scope.selectedLocations, $scope.providersData, $scope.selectAllBut).then(function (locationsToAdd) {
                    // close the modal and show the message
                    if (!addAnother) {
                        $scope.$hide();
                        $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                    }
                    // refresh the parent scope locations in the background
                    $scope.refresh();
                    $rootScope.$broadcast('event:teamLocationSavedWithProvider');
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            }
            
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
            TeamLocation.getPossibleClientLocations($scope.teamResource, $scope.createSortProperty(property)).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setSelectedLocations($scope.teamLocations);
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
         * Fetching pages on Client Locations tab
         */
        $scope.fetchPageClientLocations = function (href){
        	$scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setSelectedLocations($scope.teamLocations);
                $scope.$emit('selectAllButSome');
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
            if(!$scope.selectAllClientTeams) {
                if (!locationResource.location.entity.checked) {
                    delete $scope.selectedLocations[locationResource.location.entity.id];
                } else {
                    $scope.selectedLocations[locationResource.location.entity.id] = locationResource.location.entity;
                    locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
                }
            } else {
                if (locationResource.location.entity.checked) {
                    delete $scope.selectAllBut[locationResource.location.entity.id];
                    $scope.selectedLocations[locationResource.location.entity.id] = locationResource.location.entity;
                    locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
                } else {
                    delete $scope.selectedLocations[locationResource.location.entity.id];
                    $scope.selectAllBut[locationResource.location.entity.id] = locationResource.location.entity;
                }
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
            $scope.teamLocations = null; // clear from parent scope
        	TeamProviderService.buildMultiSelectProvidersData($scope.teamResource).then(function(response){
            	$scope.providersData = response;
            	$scope.sizeClass =  $scope.providersData.length === 0 ? 'sort col-sm-4' : 'sort col-sm-3';
                TeamLocation.getPossibleClientLocations($scope.teamResource).then(function (allLocations) {
                    $scope.handleResponse(allLocations, managedClientLocationList);
                });
        	});
        	$scope.cleanSearch();
        	$scope.tabs = TeamSearchLocation.setAllTabs();
        	window.paul = $scope;
        }
        init();

    }])
;
