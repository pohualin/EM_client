'use strict';

angular.module('emmiManager')

/**
 *  Controls the edit location popup (admin-facing/partials/location/edit.html)
 */
    .controller('LocationEditController', function ($scope, $controller, $alert, Location, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.title = 'Edit Location';

        $scope.saveLocation = function (isValid) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                $scope.whenSaving = true;
                Location.update(Client.getClient(), toBeSaved).then(function (response) {
                    var locationResource = response.data;
                    // set belongsTo property
                    $scope.setBelongsToPropertiesFor(locationResource.entity);
                    // overwrite original location with saved one
                    angular.copy(locationResource.entity, $scope.originalLocation);
                    $scope.$hide();
                    $alert({
                        content: 'The location <b>'+response.data.entity.name+'</b> has been successfully updated.'
                    });
                }).finally(function () {
                    $scope.whenSaving = false;
                });
                _paq.push(['trackEvent', 'Form Action', 'Client Location Edit', 'Save']);
            } else {
                $scope.showErrorBanner();
            }
        };

        $scope.doNotDeactivateLocation = function(){
            $scope.location.active = true;
        };
    })
;
