'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope, $translate,TeamSearchLocation, Location, Client) {

        $scope.cleanSearch = function() {
            $scope.clientLocationsSearch = true;
            $scope.allLocationsSearch = true;
            $scope.clientLocationsSelected = [];
            $scope.locations = null;
            $scope.cancelPopup(); //clean the locations checked in other search
            $scope.locationQuery = '';
            Location.findForClient(Client.getClient()).then(function (allLocations) {
                $scope.clientLocations = allLocations.content;

                angular.forEach( $scope.clientLocations , function (location) {
                    if ($scope.teamLocations[location.location.entity.id]) {
                        location.location.entity.isNewAdd = false;
                        location.location.entity.disabled = true;
                        location.location.entity.checked = true;                
                        $scope.clientLocationsSelected.push(location);
                    }
                }); 
            });
        };

        $scope.clientHasLocations = function () {
            return $scope.clientLocations && $scope.clientLocations.length > 0;
        };

        $scope.savePopupLocations = function() {
            var locationsToAdd = [];

            angular.forEach( $scope.clientLocationsSelected , function (location) {
                if ($scope.teamLocations[location.location.entity.id]) {
                    $scope.teamLocations[location.location.entity.id] = angular.copy(location.location.entity);  
                }
            });
            angular.forEach( $scope.teamLocations , function (location) {
                if (location.isNewAdd) {
                    locationsToAdd.push(location);
                }
            });

            if (locationsToAdd.length > 0) {
                TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations,locationsToAdd).then(function () {
                    $scope.save(true, locationsToAdd);
                });
            } else {
                $scope.save(false, locationsToAdd);
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
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.locations = locationPage.content ;
                angular.forEach( $scope.locations , function (location) {
                    if ($scope.teamLocations[location.location.entity.id]) {
                        location.location.entity.disabled = true;
                        location.location.entity.checked = true;
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
            if (!locationResource.location.entity.checked) {
                delete $scope.teamLocations[locationResource.location.entity.id];
            } else {
                locationResource.location.entity.isNewAdd = true;
                $scope.teamLocations[locationResource.location.entity.id] = angular.copy(locationResource.location.entity);
            }
        };

        $scope.onDropdownChange = function () {          
            $scope.locations = null;
            $scope.clientLocationsSearch = true;
            $scope.allLocationsSearch = false;    

            //remove all the new added then add the selected
            angular.forEach( $scope.clientLocations , function (location) {
                if ($scope.teamLocations[location.location.entity.id] && $scope.teamLocations[location.location.entity.id].isNewAdd) {
                    delete $scope.teamLocations[location.location.entity.id];
                }
            });

            angular.forEach( $scope.clientLocationsSelected , function (location) {
                if (!$scope.teamLocations[location.location.entity.id]) {
                    location.location.entity.isNewAdd = true;
                    $scope.teamLocations[location.location.entity.id] = angular.copy(location.location.entity);  
                }
            });

        };

        $scope.onKeypress = function () {  

        };

        $scope.cleanSearch();

    })

;