'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.editLocation = function (location) {
            // create a copy for editing
            $scope.location = angular.copy(location);

            // save the original for overlay if save is clicked
            $scope.originalLocation = location;

            // set belongsTo property
            $scope.setBelongsToPropertiesFor($scope.location);

            // show the dialog box
            $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});

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
                dismissable: true,
                placement: 'top'
            });
        };

        $scope.addLocations = function () {
           $modal({scope: $scope, template: 'partials/team/location/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
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

        $scope.displaySuccessfull = function(locationsToAdd, container, addAnother) {
            var message = (locationsToAdd.length === 1) ?
                ' <b>' + locationsToAdd[0].name + '</b> has been added successfully.' :
                'The new locations have been added successfully.';
            var placement = addAnother ? '': 'top';

            $alert({
                title: ' ',
                content: message,
                container: container,
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true,
                placement: placement
            });
        };

        $scope.refresh = function() {
            TeamLocation.loadTeamLocationsSimple($scope).then(function(pageLocations) {
                $scope.handleResponse(pageLocations, managedLocationList);
                $scope.fetchAllPages(pageLocations);
            });
        };

        $scope.save = function (locationsToAdd, addAnother) {
            $scope.refresh();

            if (addAnother) {
                $scope.addLocations();
                $scope.displaySuccessfull(locationsToAdd, '#message-container', addAnother);
            } else {
                $scope.displaySuccessfull(locationsToAdd, '#remove-container', addAnother);
            }
        };

        $scope.removeExistingLocation = function (locationResource) {
            TeamLocation.removeLocation(locationResource).then(function () {
                $scope.refresh();
                $scope.showRemovalSuccess(locationResource);
            });
        };

        $scope.fetchPage = function (href) {
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            });
        };

        $scope.fetchAllPages = function (content) {
            //fetch all pages in order to fill the dropdown with all clients locations, not only the first page.
            angular.forEach(content.linkList, function(link, key) {
                if (key >= 1 && key < content.page.totalPages) {
                    Location.fetchPageLink(link.href).then(function (clientPage) {
                        angular.forEach(clientPage.content, function (teamLocation) {
                            $scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);
                        });                        
                    });
                }
            });
        };

        if ($scope.teamClientResource.teamResource.entity.id) { // to check is the team is created
            $scope.refresh();
        }

    })

 ;
