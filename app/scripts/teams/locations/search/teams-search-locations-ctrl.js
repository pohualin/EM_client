'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope, Location) {

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
        };

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