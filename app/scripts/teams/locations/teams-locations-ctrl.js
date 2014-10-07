'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, TeamLocation, Location, $http, Session, UriTemplate, $controller, Client, $modal) {

        TeamLocation.getReferenceData().then(function (refData) {
            $scope.clientsWithLocationsLnk = refData.link.clientWithLocations;       
        });

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;
        });

        $scope.clientHasLocations = function () {
            return $scope.clientLocations.length > 0;      
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
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

    })

;