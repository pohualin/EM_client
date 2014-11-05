'use strict';

angular.module('emmiManager')

    .controller('SearchTeamsLocationsController', function ($scope, $translate, $controller,$filter,TeamSearchLocation, Location, Client) {

        $scope.pageSizes = [5, 10, 15, 25];

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        var managedLocationList = 'locations';

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


        $scope.setLocationChecked = function () {
            angular.forEach( $scope.locations , function (location) {
                if ($scope.teamLocations[location.location.entity.id]) {
                    location.location.entity.disabled = true;
                    location.location.entity.checked = true;
                }
            });
        };

        $scope.search = function () {
            
            $scope.loading = true;
            $scope.locations = null;
            $scope.cancelPopup(); //clean the locations checked in other search
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status).then(function (locationPage) {
                //matching locations associated to the client are listed first (top)in alphabetical order followed by all other matcing results inalphabetical order
                var associated = [], other = [];
                var isClientLocation = false;

                angular.forEach( locationPage.content, function (location) {
                    isClientLocation = false;
                    angular.forEach( $scope.clientLocationsSelected , function (locationAssoc) {
                        if (location.location.entity.id === locationAssoc.location.entity.id) {
                            isClientLocation = true;
                        } 
                    });

                    if (isClientLocation) {
                        associated.push(location);
                    } else {
                        other.push(location);                            
                    }
                });

                associated = $filter('orderBy')(associated, '+entity.location.name', false);
                angular.forEach(other, function (teamLocation) {
                    associated.push(teamLocation);
                });
                locationPage.content = associated;
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setLocationChecked();
                $scope.clientLocationsSearch = false;
                $scope.allLocationsSearch = true;
                $scope.clientLocationsSelected = null;
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

        $scope.cleanSearch();

    })

;