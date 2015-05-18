'use strict';

angular.module('emmiManager')

/**
 *  Controls the create new location popup (admin-facing/partials/location/new.html) from a Team search page
 */
    .controller('TeamLocationCreateController', function ($rootScope, $scope, $controller, Location, TeamSearchLocation, $alert, Client, TeamLocation, $timeout) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();
        $scope.newLocation = true;
        $scope.title = 'New Location';
        $scope.location.providersSelected =  angular.copy($scope.providersData);

        $scope.location.name = $scope.searchAll.locationQuery;

        $scope.saveAndAddAnother = function (isValid) {
            $scope.saveLocation(isValid, true);
        };

        $scope.saveLocation = function (isValid, addAnother) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                _paq.push(['trackEvent', 'Form Action', 'Team Location Create', 'Save']);
                Location.create(Client.getClient(), toBeSaved).then(function (location) {
                    var teamProviderTeamLocationSaveRequest = [];
                    var req = {};
                    req.location = location.data.location.entity;
                    if ($scope.providersData.length === $scope.location.providersSelected.length) {
                        req.providers = [];
                    } else {
                        req.providers = $scope.location.providersSelected;
                    }
                    teamProviderTeamLocationSaveRequest.push(req);

                    return TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations,teamProviderTeamLocationSaveRequest).then(function (page) {
                        // close the modal
                        $scope.$hide();
                        if (!addAnother) {
                            // refresh the parent scope locations in the background
                            $scope.refresh();
                            $scope.displaySuccessfull(teamProviderTeamLocationSaveRequest, '#messages-container');
                        } else {
                            $scope.refresh().then(function () {
                                $scope.addLocations().then(function () {
                                    $scope.displaySuccessfull(teamProviderTeamLocationSaveRequest, '#modal-messages-container');
                                });
                            });
                        }
                        $rootScope.$broadcast('event:teamLocationSavedWithProvider');
                        return teamProviderTeamLocationSaveRequest;
                    });
                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;
