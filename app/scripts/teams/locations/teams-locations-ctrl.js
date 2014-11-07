'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation) {

        $controller('CommonPagination', {$scope: $scope});
        
        $scope.pageSizes = [5, 10, 15, 25];

        var managedLocationList = 'locations';
        
        $scope.teamLocations = {}; //used to hold the locations and manipulate internally

        $scope.showRemovalSuccess = function (locationResource) {
            $alert({
                title: ' ',
                content: 'The location <b>' + locationResource.entity.location.name + '</b> has been successfully removed from ' + locationResource.entity.team.name,
                container: '#remove-container',
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true
            });
        };

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

        $scope.save = function (reload, locationsToAdd) {
            if (reload) {
                TeamLocation.loadTeamLocations($scope,locationsToAdd).then(function(pageLocations) {
                    $scope.handleResponse(pageLocations, managedLocationList);
                });
            }
            
            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);
        };

        $scope.removeExistingLocation = function (locationResource) {
            TeamLocation.removeLocation(locationResource).then(function () {
                TeamLocation.loadTeamLocationsSimple($scope,[]).then(function(pageLocations) {
                    $scope.handleResponse(pageLocations, managedLocationList);
                    $scope.showRemovalSuccess(locationResource);
                    delete $scope.teamLocations[locationResource.entity.location.id];
                });
            });
        };

        $scope.changePageSize = function (pageSize) {
            TeamLocation.loadTeamLocations($scope, [], $scope.sortProperty, pageSize).then(function(pageLocations) {
                $scope.handleResponse(pageLocations, managedLocationList);
            });
        };

        $scope.fetchPage = function (href) {
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            });
        };        

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/team/locations/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});
        
        if ($scope.teamClientResource.teamResource.entity.id) { // to check is the team is created
            TeamLocation.loadTeamLocationsSimple($scope, []).then(function(pageLocations) {
                $scope.handleResponse(pageLocations, managedLocationList);
            });
        }

    })

 ;