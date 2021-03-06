'use strict';

angular.module('emmiManager')

/**
 *  Controls the create new location popup (admin-facing/partials/location/new.html)
 */
    .controller('LocationCreateController', function ($scope, $controller, Location, $alert, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();

        $scope.title = 'New Location';

        if($scope.locationQuery){
            $scope.location.name = $scope.locationQuery;
        }

        $scope.newLocation = true;

        $scope.saveAndAddAnother = function (isValid) {
            $scope.saveLocation(isValid, true);
        };

        $scope.saveLocation = function (isValid, addAnother) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                $scope.whenSaving = true;
                Location.create(Client.getClient(), toBeSaved).then(function (location) {
                    // reload the existing locations
                    $scope.performSearch();

                    var locationResource = location.data.location;
                    $scope.hideNewLocationModal();
                    if (addAnother) {
                        $scope.addLocations();
                        $alert({
                            content: 'The location <b>' + locationResource.entity.name + '</b> has been successfully created.',
                            container: '#modal-messages-container'
                        });
                    } else {
                        $alert({
                            content: '<b>' +locationResource.entity.name + '</b> has been added successfully.',
                            container: '#messages-container'
                        });
                    }
                }).finally(function () {
                    $scope.whenSaving = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'Client Location Create', 'Save']);
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;
