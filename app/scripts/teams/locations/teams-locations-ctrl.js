'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation) {

        $scope.teamLocations = {}; //used to hold the locations and manipulate internally

        $scope.showRemovalSuccess = function (locationResource) {
            $alert({
                title: ' ',
                content: 'The Team location <b>' + locationResource.entity.location.name + '</b> has been successfully removed from ' + locationResource.entity.team.name,
                container: '#remove-container',
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true
            });
        };

        TeamLocation.loadTeamLocations($scope, []);

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.cancelPopup = function() {
            //doing this to remove the teamLocations those locations that was clicked in the search and them press cancel
            var teamLocationsAux = {};
            angular.forEach( $scope.teamLocations , function (location) {
                if (!location.isNewAdd) {
                    teamLocationsAux[location.id] = angular.copy(location);
                }
            });
            $scope.teamLocations = angular.copy(teamLocationsAux);
        };

        $scope.teamHasLocations = function () {
            return $scope.teamClientResource.teamResource.locations && $scope.teamClientResource.teamResource.locations.length > 0;  
        };

        $scope.save = function (reload, locationsToAdd) {
            if (reload) {
                TeamLocation.loadTeamLocations($scope,locationsToAdd);
            }
            
            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);
        };

        $scope.removeExistingLocation = function (locationResource) {
            TeamLocation.removeLocation(locationResource).then(function () {
                TeamLocation.loadTeamLocations($scope,[]).then(function() {
                    $scope.showRemovalSuccess(locationResource);
                    delete $scope.teamLocations[locationResource.entity.location.id];
                });
            });
        };

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

    })

 ;