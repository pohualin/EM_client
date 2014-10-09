'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, TeamLocation, Location, $http, Session, UriTemplate, $controller, Client, $modal) {

        $scope.teamLocations = {};
        $scope.teamLocationsArray = [];


        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;
        });

        $scope.teamHasLocations = function () {

            return $scope.teamLocationsArray && $scope.teamLocationsArray.length > 0;  
            //return false;    
        };

        $scope.save = function (addAnother) {
            $scope.teamLocationsArray = [];
            angular.forEach( $scope.teamLocations , function (location) {
                $scope.teamLocationsArray.push(location);
            });

            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

    })

    .controller('SearchTeamsLocationsController', function ($scope, Location, $http) {

        $scope.clientHasLocations = function () {
            return $scope.clientLocations.length > 0;      
        };

        $scope.cancel = function () {
            $scope.$hide();
        };

        $scope.search = function () {
            $scope.changedLocations = {};
            $scope.loading = true;
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.locations = locationPage.content ;
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
            if (locationResource.entity.currentNewLocationState === locationResource.entity.newlocation) {
                // the checkbox is the same as it was at the start, location not changed
                delete $scope.teamLocations[locationResource.entity.id];
            } else {
                locationResource.entity.currentNewLocationState = true;
                // this is a change from the saved state, store a copy of the object
                $scope.teamLocations[locationResource.entity.id] = angular.copy(locationResource);
            }
        };
    })

;