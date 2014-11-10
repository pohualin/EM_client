'use strict';

angular.module('emmiManager')

/**
 *  Controls the create new location popup (partials/location/new.html)
 */
    .controller('LocationCreateController', function ($scope, $controller, Location, $alert, Client) {

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
                    // reload the existing locations
                    $scope.performSearch();

                    var locationResource = location.data.location;
                    $scope.hideNewLocationModal();
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
                    } else {
                        $alert({
                            title: ' ',
                            content: ' <b>' +locationResource.entity.name + '</b> has been added successfully.',
                            container: '#remove-container',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    }
                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;