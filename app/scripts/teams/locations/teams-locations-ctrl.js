'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, TeamLocation, Location, $http, Session, UriTemplate, $controller, Client, $modal) {

        TeamLocation.getReferenceData().then(function (refData) {
            $scope.clientsWithLocationsLnk = refData.link.clientWithLocations;
            TeamLocation.findClientsWithLocations($scope.clientsWithLocationsLnk).then(function (refData) {
                $scope.clientsWithLocations = refData;
            });            
        });

        $scope.clientHasLocations = function () {
            return $scope.clientsWithLocations.length > 0;      
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
            $scope.$hide();
        };

    })

;