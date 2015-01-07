'use strict';

angular.module('emmiManager')

/**
 *  Controls the edit location popup (partials/location/edit.html)
 */
    .controller('TeamLocationEditController', function ($scope, $controller, Location, Client, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.title = 'Edit Location';

        $scope.saveLocation = function (isValid) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.update(Client.getClient(), toBeSaved).then(function (response) {
                    var locationResource = response.data;

                    var req = {};
                    req.location = locationResource.entity;
                    
                    // set belongsTo property
                    $scope.setBelongsToPropertiesFor(locationResource.entity);

                    // overwrite original location with saved one
                    angular.copy(locationResource.entity, $scope.originalLocation);
                    $scope.$hide();
                });
                _paq.push(['trackEvent', 'Form Action', 'Team Location Edit', 'Save']);
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;
