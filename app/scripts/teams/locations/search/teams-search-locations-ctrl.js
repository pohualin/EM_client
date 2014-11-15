'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope,$modal, $controller,TeamSearchLocation, Location, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        var managedLocationList = 'locations';

        $scope.tabs = {};

        $scope.hasLocationsAdded = function() {
            var resp = false;
            angular.forEach( $scope.teamLocations , function (location) {
                if (location.isNewAdd) {
                    resp = true;
                }
            });
            return resp;
        };

        $scope.cleanSearch = function() {
            $scope.allLocationsSearch = false;
            $scope.locations = null;
            $scope.cancelPopup(); //clean the locations checked in other search
            $scope.locationQuery = '';
            Location.findForClient(Client.getClient()).then(function (allLocations) {
                $scope.clientLocations = allLocations.content;
                
                angular.forEach( $scope.clientLocations , function (location) {
                    if ($scope.teamLocations[location.location.entity.id]) {
                        $scope.teamLocations[location.location.entity.id].isNewAdd = false;
                        $scope.teamLocations[location.location.entity.id].disabled = true;
                        $scope.teamLocations[location.location.entity.id].checked = true;
                        $scope.teamLocations[location.location.entity.id].associated = true;
                        location.location.entity.isNewAdd = false;
                        location.location.entity.disabled = true;
                        location.location.entity.checked = true;
                    }
                });
            });
        };

        $scope.clientHasLocations = function () {
            return $scope.clientLocations && $scope.clientLocations.length > 0;
        };

        $scope.saveAndAddAnother = function () {
            $scope.savePopupLocations(true);
        };

        $scope.savePopupLocations = function(addAnother) {
            var locationsToAdd = [];

            angular.forEach( $scope.teamLocations , function (location) {
                if (location.isNewAdd) {
                    location.isNewAdd = false;
                    locationsToAdd.push(location);
                }
            });

            TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations,locationsToAdd).then(function () {
                $scope.$hide();
                $scope.save(locationsToAdd,addAnother, 'added');
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
            });
        };

        $scope.search = function (term) {
            if (term.$valid){
                $scope.loading = true;
                $scope.locations = null;
                $scope.cancelPopup(); //clean the locations checked in other search
                Location.find(Client.getClient(), $scope.locationQuery, $scope.status).then(function (locationPage) {
                    $scope.handleResponse(locationPage, managedLocationList);
                    $scope.setLocationChecked();
                    $scope.allLocationsSearch = true;
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            }
        };

        // when a column header is clicked
        $scope.sort = function (property) {
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
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, sort, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setLocationChecked();
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (locationPage) {
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

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setLocationChecked();
            }, function () {
                // error happened
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
            } else {
                locationResource.location.entity.isNewAdd = true;
                $scope.teamLocations[locationResource.location.entity.id] = angular.copy(locationResource.location.entity);
            }
        };

        $scope.createNewTeamLocation = function () {
            $scope.$hide();
            $modal({scope: $scope, template: 'partials/team/location/new.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
        };

        $scope.cleanSearch();

    })

;
