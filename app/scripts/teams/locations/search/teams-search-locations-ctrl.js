'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope, $translate,TeamSearchLocation, Location, Client) {

        $scope.clientLocationsSearch = true;
        $scope.allLocationsSearch = true;
        $scope.clientLocationsSelected = [];

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;

            angular.forEach( $scope.clientLocations , function (location) {
                if ($scope.teamLocations[location.entity.id]) {
                    location.entity.isNewAdd = false;
                    location.entity.disabled = true;
                    location.entity.checked = true;                
                    $scope.clientLocationsSelected.push(location);
                }
            }); 
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
            $scope.clientLocationsSelected = null;

            $scope.loading = true;
            $scope.locations = null;
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
                $scope.clientLocationsSearch = false;
                $scope.allLocationsSearch = true;
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
            $scope.clientLocationsSearch = true;
            $scope.allLocationsSearch = false;            
            angular.forEach( $scope.clientLocationsSelected , function (location) {
                if (!$scope.teamLocations[location.entity.id]) {
                    location.entity.isNewAdd = true;
                    $scope.teamLocations[location.entity.id] = angular.copy(location.entity);  
                }
            });

        };

    })

;