'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', ['$rootScope', '$scope', '$http', 'Session', 'UriTemplate', '$controller', '$modal', '$alert', 'Location', 'TeamLocation', 'Client', function ($rootScope, $scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        var managedLocationList = 'locations';

        $scope.teamLocations = {}; //used to hold the locations and manipulate internally

        $scope.editLocation = function (location) {

        	// create a copy for editing
            $scope.location = angular.copy(location.entity.location);
            $scope.locationResource = location;

            // save the original for overlay if save is clicked
            $scope.originalLocation = location.entity.location;

            // set belongsTo property
            $scope.setBelongsToPropertiesFor($scope.location);

            // show the dialog box, to avoid display the popup without the providers
            $modal({scope: $scope, template: 'admin-facing/partials/team/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});

            _paq.push(['trackEvent', 'Form Action', 'Team Location', 'Edit']);

        };

        $scope.showRemovalSuccess = function (locationResource) {
            $alert({
                title: ' ',
                content: 'The location <b>' + locationResource.entity.location.name + '</b> has been successfully removed.',
                container: '#messages-container',
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true,
                placement: 'top'
            });
        };
        
        $scope.addLocations = function (addAnother) {
        	$scope.addAnother = addAnother;
            Location.findForClient(Client.getClient()).then(function (allLocations) {
            	if(allLocations.content && allLocations.content.length > 0){
                	$modal({scope: $scope, template: 'admin-facing/partials/team/location/searchWCLTabs.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
                }
                else{
                	$modal({scope: $scope, template: 'admin-facing/partials/team/location/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
                }
            });
        	
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
            });
        };

        $scope.save = function (locationsToAdd, addAnother) {
            $scope.refresh();

            if (addAnother) {
                $scope.addLocations(true);
                $scope.displaySuccessfull(locationsToAdd, '#modal-messages-container', addAnother);
            } else {
                $scope.displaySuccessfull(locationsToAdd, '#messages-container', addAnother);
            }
        };

        $scope.removeExistingLocation = function (locationResource) {
            TeamLocation.removeLocation(locationResource).then(function () {
                $scope.refresh();
                $scope.showRemovalSuccess(locationResource);
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            });
            _paq.push(['trackEvent', 'Form Action', 'Team Location', 'Remove']);
        };

        $scope.fetchPage = function (href) {
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            });
        };

        if ($scope.teamClientResource.teamResource.entity.id) { // to check is the team is created
            $scope.refresh();
        }

    }])

 ;
