'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        var editLocationModal = $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.editLocation = function (location) {
            // create a copy for editing
            $scope.location = angular.copy(location);

            // save the original for overlay if save is clicked
            $scope.originalLocation = location;

            // set belongsTo property
            $scope.setBelongsToPropertiesFor($scope.location);

            // show the dialog box
            editLocationModal.$promise.then(editLocationModal.show);
        };

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

        $scope.displaySuccessfull = function(locationsToAdd, container) {
            var message = (locationsToAdd.length === 1) ?
                ' <b>' + locationsToAdd[0].name + '</b> has been added successfully.' :
                'The new locations have been added successfully.';

            $alert({
                title: ' ',
                content: message,
                container: container,
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true
            });  
        };

        $scope.save = function (locationsToAdd, addAnother) {
            TeamLocation.loadTeamLocations($scope,locationsToAdd).then(function(pageLocations) {
                $scope.handleResponse(pageLocations, managedLocationList);
            });     

            addNewLocationsModal.$promise.then(addNewLocationsModal.hide);

            if (addAnother) {
                $scope.addLocations();
                $scope.displaySuccessfull(locationsToAdd, '#message-container');     
            } else {
                $scope.displaySuccessfull(locationsToAdd, '#remove-container');     
            }
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