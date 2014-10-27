'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope, $translate,TeamSearchLocation, Location) {

        $scope.noSearch = true;

        $scope.clientLocationsSelected = [];

        angular.forEach( $scope.clientLocations , function (location) {
            if ($scope.teamLocations[location.entity.id]) {
                location.entity.isNewAdd = false;
                location.entity.disabled = true;
                location.entity.checked = true;                
                $scope.clientLocationsSelected.push(location);
            }
        }); 

        $scope.clientHasLocations = function () {
            return $scope.clientLocations.length > 0;
        };

        $scope.savePopupLocations = function() {
            var locationsToAdd = [];

            angular.forEach( $scope.clientLocationsSelected , function (location) {
                if ($scope.teamLocations[location.entity.id]) {
                    $scope.teamLocations[location.entity.id] = angular.copy(location.entity);  
                }
            });
            angular.forEach( $scope.teamLocations , function (location) {
                if (location.isNewAdd) {
                    locationsToAdd.push(location);
                }
            });

            if (locationsToAdd.length > 0) {
                TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations,locationsToAdd).then(function () {
                    $scope.save(true);
                });
            } else {
                $scope.save(false);
            }
        };

        $scope.hidePopupLocations = function () {
            $scope.cancelPopup();
            $scope.$hide();
        };

        $scope.search = function () {
            $("#fromClientLocations").hide();
            $scope.clientLocationsSelected = [];
            $scope.loading = true;
            $scope.locations = [];
            $scope.cancelPopup(); //clean the locations checked in other search
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.locations = locationPage.content ;
                angular.forEach( $scope.locations , function (location) {
                    if ($scope.teamLocations[location.entity.id]) {
                        location.entity.disabled = true;
                        location.entity.checked = true;
                    }
                });
                $scope.loading = false;
                $scope.noSearch = false;
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
                $scope.teamLocations[locationResource.entity.id] = angular.copy(locationResource.entity);
            }
        };

        $scope.onDropdownChange = function () {
            $scope.locations = null;
             $("#allLocations").hide();
            angular.forEach( $scope.clientLocationsSelected , function (location) {
                if (!$scope.teamLocations[location.entity.id]) {
                    location.entity.isNewAdd = true;
                    $scope.teamLocations[location.entity.id] = angular.copy(location.entity);  
                }
            });

        };

    })

;