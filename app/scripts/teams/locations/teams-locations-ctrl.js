'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, Location, Client, TeamLocation) {

        $scope.teamLocations = {}; //used to hold the locations and manipulate internally

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;
        });

        TeamLocation.loadTeamLocations($scope);

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.cancelPopup = function() {
            //doing this to remove the teamLocations those locations that was clicked in the search and them press cancel
            var teamLocationsAux = {}
            angular.forEach( $scope.teamLocations , function (location) {
                if (!location.isNewAdd) {
                    teamLocationsAux[location.id] = angular.copy(location);
                }
            });
            $scope.teamLocations = angular.copy(teamLocationsAux);
        }

        $scope.teamHasLocations = function () {
            return $scope.teamClientResource.teamResource.locations && $scope.teamClientResource.teamResource.locations.length > 0;  
        };

        $scope.save = function (reload) {
            if (reload) {
                TeamLocation.loadTeamLocations($scope);
            }
            
            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

    })

 ;