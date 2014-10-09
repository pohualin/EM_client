'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, TeamLocation, Location, $http, Session, UriTemplate, $controller, Client, $modal) {

        $scope.teamLocations = {}; //used to hold the locations and manipulate internally
        $scope.teamLocationsArray = []; //used to display in the locations list of the team

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;
        });

        $scope.teamHasLocations = function () {
            return $scope.teamLocationsArray && $scope.teamLocationsArray.length > 0;  
        };

        $scope.save = function (locations) {
            $scope.teamLocationsArray = [];

            angular.forEach( locations , function (location) {
                location.entity.isNewAdd = true;
                $scope.teamLocations[location.entity.id] = angular.copy(location);  
            });
            angular.forEach( $scope.teamLocations , function (location) {
                $scope.teamLocationsArray.push(location);
            });

            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

    })

    .controller('SearchTeamsLocationsController', function ($scope, Location, $http) {

        $scope.clientLocationsSelected = [];

        angular.forEach( $scope.clientLocations , function (location) {
            if ($scope.teamLocations[location.entity.id]) {
                $scope.clientLocationsSelected.push(location);
            }
        }); 

        $scope.clientHasLocations = function () {
            return $scope.clientLocations.length > 0;
        };

        $scope.savePopupLocations = function() {
            $scope.$hide();
            $scope.save($scope.clientLocationsSelected);
        }

        $scope.hidePopupLocations = function () {
            $scope.$hide();
        };

        $scope.search = function () {
            $scope.clientLocationsSelected = [];
            $scope.loading = true;
            $scope.locations = [];
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.locations = locationPage.content ;
                angular.forEach( $scope.locations , function (location) {
                    if ($scope.teamLocations[location.entity.id]) {
                        location.entity.disabled = true;
                        location.entity.checked = true;
                    }
                });
                $scope.loading = false;
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
            if (!locationResource.entity.checked) {
                delete $scope.teamLocations[locationResource.entity.id];
            } else {
                locationResource.entity.isNewAdd = true;
                // this is a change from the saved state, store a copy of the object
                $scope.teamLocations[locationResource.entity.id] = angular.copy(locationResource);
            }
        };

        $scope.onDropdownChange = function () {
            $scope.locations = null;
        };

    })

;