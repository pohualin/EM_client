'use strict';

angular.module('emmiManager')

    .controller('TeamsLocationsController', ['$rootScope', '$scope', '$http', 'Session', 'UriTemplate', '$controller', '$modal', '$alert', 'Location', 'TeamLocation', 'Client', 'ClientTeamSchedulingConfigurationService', function ($rootScope, $scope, $http, Session, UriTemplate, $controller, $modal, $alert, Location, TeamLocation, Client, ClientTeamSchedulingConfigurationService) {

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
            $modal({
                scope: $scope,
                template: 'admin-facing/partials/team/location/edit.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: true,
                backdrop: 'static'
            });

            _paq.push(['trackEvent', 'Form Action', 'Team Location', 'Edit']);

        };

        $scope.showRemovalSuccess = function (locationResource) {
            $alert({
                content: 'The location <b>' + locationResource.entity.location.name + '</b> has been successfully removed.'
            });
        };

        $scope.addLocations = function (activeTab) {
        	return Location.findForClient(Client.getClient()).then(function (allLocations) {
            	var locationTemplate = allLocations.content && allLocations.content.length > 0 ? 'admin-facing/partials/team/location/search-with-client-location-tabs.html' : 'admin-facing/partials/team/location/search-without-client-location-tabs.html';
            	$scope.activeTab = activeTab ? activeTab : 0;
               	$modal({
            		scope: $scope,
                    template: locationTemplate,
            		animation: 'none',
            		backdropAnimation: 'emmi-fade',
            		show: true,
            		backdrop: 'static'});
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

        $scope.displaySuccessfull = function(locationsToAdd, container) {
            var message = (locationsToAdd.length === 1) ?
                ' <b>' + locationsToAdd[0].location.name + '</b> has been successfully added.' :
                'The new locations have been successfully added.';
            $alert({
                content: message,
                container: container
            });
        };

        $scope.refresh = function() {
            $scope.loading = true;
            return ClientTeamSchedulingConfigurationService.getTeamSchedulingConfiguration($scope.teamResource).then(function (schedulingConfiguration) {
                $scope.schedulingConfiguration = schedulingConfiguration;
                if ($scope.schedulingConfiguration.entity.useLocation) {
                    $scope.teamLocations = {};
                    return TeamLocation.loadTeamLocationsSimple($scope.teamClientResource.teamResource.link.teamLocations).then(function(pageLocations) {
                        angular.forEach(pageLocations.content, function (teamLocation) {
                            $scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);
                        });
                        $scope.handleResponse(pageLocations, managedLocationList);
                    });
                } else {
                    $scope.loading = false;
                }
            });
        };

        $scope.removeExistingLocation = function (locationResource) {
            $scope.whenSaving = true;
            TeamLocation.removeLocation(locationResource).then(function () {
                $scope.refresh();
                $scope.showRemovalSuccess(locationResource);
                $rootScope.$broadcast('event:teamLocationSavedWithProvider');
            }).finally(function () {
                $scope.whenSaving = false;
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
