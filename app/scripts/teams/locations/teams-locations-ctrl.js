'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', function ($scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation, ProviderView, TeamLocationCreate) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        var managedLocationList = 'locations';
        $scope.providersData = [];
        $scope.teamLocations = {}; //used to hold the locations and manipulate internally

        $scope.editLocation = function (location) {

            $scope.fillProviders();

            // create a copy for editing
            $scope.location = angular.copy(location.entity.location);
            $scope.locationResource = location;

            $scope.location.providersSelected = [];

            // save the original for overlay if save is clicked
            $scope.originalLocation = location.entity.location;

            // set belongsTo property
            $scope.setBelongsToPropertiesFor($scope.location);

            TeamLocationCreate.findTeamLocationTeamProviders(location).then(function(pageLocations) {
                angular.forEach( pageLocations.content , function (location) {
                    location.teamProvider.entity.checked = true;
                    $scope.location.providersSelected.push(location.teamProvider.entity);
                });                
    
                // show the dialog box, to avoid display the popup without the providers
                $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
            });


        };

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
                ' <b>' + locationsToAdd[0].location.name + '</b> has been successfully added.' :
                'The new locations have been successfully added.';
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
            $scope.teamLocations = {};
            TeamLocation.loadTeamLocationsSimple($scope.teamClientResource.teamResource.link.teamLocations).then(function(pageLocations) {
                angular.forEach(pageLocations.content, function (teamLocation) {
                    $scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);
                });
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
            //for (var i = 1; i<content.page.totalPages; i++) {
               if (content.link && content.link['page-next']) {
                    $http.get(content.link['page-next']).then(function (response) {
                        angular.forEach(response.data.content, function (teamLocation) {
                            $scope.locations.push(teamLocation);
                            $scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);
                        }); 
                        $scope.fetchAllPages(response);
                    });
                }
            //}
        };

        $scope.fillProviders = function() {
            ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
                $scope.providersData = [];
                angular.forEach( response , function (location) {
                    $scope.providersData.push(location.entity);
                });
            });
        };

        if ($scope.teamClientResource.teamResource.entity.id) { // to check is the team is created
            $scope.refresh();
            $scope.fillProviders();
        }

    })

 ;
