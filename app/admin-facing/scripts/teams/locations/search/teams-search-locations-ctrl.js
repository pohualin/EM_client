'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($rootScope, $scope, $modal, $controller,TeamSearchLocation, Location, Client, ProviderView, TeamProviderService, focus) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.teamClientLocations = {};
        $scope.searchAll = {};
        var managedLocationList = 'locations';
        var managedClientLocationList = 'clientLocations';

        $scope.hasLocationsAdded = function() {
        	var resp = false;
            angular.forEach( $scope.teamLocations , function (location) {
                if (location.isNewAdd) {
                    resp = true;
                }
            });
            if (!resp) {
                angular.forEach( $scope.teamClientLocations , function (location) {
                    resp = true;
                });
            }
            return resp ;
        };

        //set which the client locations are associated to the team
        $scope.setClientLocationSelected = function (locations) {
        	angular.forEach( locations , function (location) {
            	if ($scope.teamLocations[location.location.entity.id]) {
                	$scope.teamLocations[location.location.entity.id].isNewAdd = false;
                    $scope.teamLocations[location.location.entity.id].disabled = true;
                    $scope.teamLocations[location.location.entity.id].checked = true;
                    $scope.teamLocations[location.location.entity.id].associated = true;
                    location.location.entity.isNewAdd = false;
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
            $scope.searchAll.locationQuery = null;
            $scope.cancelPopup(); //clean the locations checked in other search
        };

        $scope.savePopupLocations = function(addAnother) {
        	var locationsToAdd = TeamSearchLocation.getTeamProviderTeamLocationSaveRequest($scope.teamClientLocations, $scope.teamLocations, $scope.providersData);
            return TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations, locationsToAdd).then(function () {
                // close the modal and show the message
                if (!addAnother) {
                    $scope.$hide();
                    // refresh the parent scope locations in the background
                    $scope.refresh();
                    $scope.displaySuccessfull(locationsToAdd, '#messages-container');
                }
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
                return locationsToAdd;
            });
        };

        $scope.saveAndAddAnother = function () {
            $scope.savePopupLocations(true).then(function (locationsToAdd) {
                // refresh the team background info
                $scope.refresh().then(function () {
                    $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container');
                    // if on the client locations tab
                    if ($scope.tabs.activeTab === 0) {
                        // disable previously selected locations
                        $scope.setClientLocationSelected($scope.clientLocations);
                    }
                    // set the active tab to search per UAT ticket EM-1029
                    $scope.tabs.activeTab = 1;
                    $scope.cleanSearch();
                    focus('LocationSearchFocus');
                });
            });
        };

        $scope.hidePopupLocations = function () {
            $scope.cancelPopup();
            $scope.$hide();
        };

        //disabled the already selected and also search results will not contain associated client locations
        $scope.setLocationChecked = function () {
        	angular.forEach( $scope.locations , function (location) {
                if ($scope.teamLocations[location.location.entity.id]) {
                    location.location.entity.disabled = !$scope.teamLocations[location.location.entity.id].isNewAdd ;
                    location.location.entity.checked = true;
                }
                location.location.entity.providersSelected =  angular.copy($scope.providersData);
            });
        };

        $scope.search = function (term) {
        	if (term.$valid){
                $scope.loading = true;
                $scope.locations = null;
                $scope.cancelPopup(); //clean the locations checked in other search
                Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.status).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.setLocationChecked();
                    $scope.allLocationsSearch = true;
                }, function () {
                    $scope.loading = false;
                });
            }
        };

        // when a column header is clicked
        $scope.sortTeam = function (property) {
        	$scope.loading = true;
            Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.status, $scope.sort(property), $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setLocationChecked();
            }, function () {
                $scope.loading = false;
            });
        };

        $scope.sort = function(property) {
            var sort = $scope.sortProperty || {};
            if (sort && sort.property === property) {
                // same property was clicked
                if (!sort.ascending) {
                    // third click removes sort
                    sort = null;
                } else {
                    // switch to descending
                    sort.ascending = false;
                }
            } else {
                // change sort property
                sort.property = property;
                sort.ascending = true;
            }

            return sort;
        };


        // when a column header is clicked
        $scope.sortClient = function (property) {
            $scope.loading = true;
            Location.findForClient(Client.getClient(), $scope.currentPageSize, $scope.sort(property)).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setClientLocationSelected($scope.clientLocations);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            Location.findWithoutCL(Client.getClient(), $scope.searchAll.locationQuery, $scope.status, null, $scope.currentPageSize).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.setLocationChecked();
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setLocationChecked();
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPageClientLocations = function (href) {
        	$scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedClientLocationList);
                $scope.setClientLocationSelected($scope.clientLocations);
            }, function () {
                $scope.loading = false;
            });
        };

        /**
         * Called when the checkbox on the select popup is checked or unchecked
         * @param locationResource it was checked on
         */
        $scope.onCheckboxChange = function (locationResource) {
            if (!locationResource.location.entity.checked) {
                delete $scope.teamLocations[locationResource.location.entity.id];
                locationResource.location.entity.providersSelected =  angular.copy($scope.providersData);
            } else {
                locationResource.location.entity.isNewAdd = true;
                $scope.teamLocations[locationResource.location.entity.id] = locationResource.location.entity;//angular.copy(locationResource.location.entity);
            }
        };

        $scope.onClientCheckboxChange = function (locationResource) {
            if (!locationResource.location.entity.checked) {
                delete $scope.teamClientLocations[locationResource.location.entity.id];
                locationResource.location.entity.providersSelected = angular.copy($scope.providersData);
            } else {
                $scope.teamClientLocations[locationResource.location.entity.id] = locationResource.location.entity;//angular.copy(locationResource.location.entity);
            }
        };

        $scope.createNewTeamLocation = function () {
            $scope.$hide();
            $modal({scope: $scope, template: 'admin-facing/partials/team/location/new.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
        };

        function init() {
        	$scope.status = 'ACTIVE_ONLY';
        	TeamProviderService.buildMultiSelectProvidersData($scope.teamResource).then(function(response){
            	$scope.providersData = response;
            	$scope.sizeClass =  $scope.providersData.length === 0 ? 'sort col-sm-4' : 'sort col-sm-3';
                Location.findForClient(Client.getClient()).then(function (allLocations) {
                    $scope.handleResponse(allLocations, managedClientLocationList);
                    $scope.setClientLocationSelected($scope.clientLocations);
                });
        	});
        	$scope.cleanSearch();
        	$scope.tabs = TeamSearchLocation.setAllTabs();

        }
        init();

    })
;
