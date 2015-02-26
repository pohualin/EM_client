'use strict';

angular.module('emmiManager')

/**
 *  Controls the edit location popup (admin-facing/partials/location/edit.html)
 */
    .controller('LocationEditController', function ($scope, $controller, Location, Client, TeamLocation) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.title = 'Edit Location';

        $scope.saveLocation = function (isValid) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.update(Client.getClient(), toBeSaved).then(function (response) {
                    var locationResource = response.data;

                    // set belongsTo property
                    $scope.setBelongsToPropertiesFor(locationResource.entity);

                    // overwrite original location with saved one
                    angular.copy(locationResource.entity, $scope.originalLocation);
                    $scope.$hide();
                });
                _paq.push(['trackEvent', 'Form Action', 'Client Location Edit', 'Save']);
            } else {
                $scope.showErrorBanner();
            }
        };

    })
;