'use strict';

angular.module('emmiManager')

/**
 *  Controls the create new location popup (partials/location/new.html) from a Team search page
 */
    .controller('TeamLocationCreateController', function ($scope, $controller, Location, TeamSearchLocation, $alert, Client, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();

        var managedLocationList = 'locations';

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
                        $scope.$hide();

                        $scope.refresh();
                        var container = '#remove-container';
                        var locationResource = location.data.location;
                        
                        if (addAnother) {
                            $scope.addLocations();
                            container = '#message-container';
                        }     

                        $alert({
                            title: ' ',
                            content: 'The location <b>' + locationResource.entity.name + '</b> has been successfully created.',
                            container: container,
                            type: 'success',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });                
                    });

                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;
