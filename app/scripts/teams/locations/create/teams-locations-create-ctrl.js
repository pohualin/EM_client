'use strict';

angular.module('emmiManager')

/**
 *  Controls the create new location popup (partials/location/new.html) from a Team search page
 */
    .controller('TeamLocationCreateController', function ($scope, $controller, Location, TeamSearchLocation, $alert, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();

        $scope.title = 'New Location';

        $scope.saveAndAddAnother = function (isValid) {
            $scope.saveLocation(isValid, true);
        };

        $scope.saveLocation = function (isValid, addAnother) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.create(Client.getClient(), toBeSaved).then(function (location) {
                    var locationsToAdd = [];
                    locationsToAdd.push(location.data.location.entity);

                    TeamSearchLocation.save($scope.teamClientResource.teamResource.link.teamLocations,locationsToAdd).then(function () {
                        $scope.save(locationsToAdd, false, 'created');

                        var locationResource = location.data.location;
                        $scope.$hide();
                        if (addAnother) {
                            $scope.addLocations();
                            $alert({
                                title: ' ',
                                content: 'The location <b>' + locationResource.entity.name + '</b> has been successfully created.',
                                container: '#message-container',
                                type: 'success',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }                     
                    });

                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;
