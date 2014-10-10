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

 ;