'use strict';

angular.module('emmiManager')

/**
 *  Common controller which handles reference data loading and location page response parsing
 */
    .controller('LocationCommon', function ($scope, Location, Client, $alert) {

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.noSearch = true;

        $scope.client = Client.getClient();

        $scope.setBelongsToPropertiesFor = function (location) {
            if (!location.belongsTo) {
                location.belongsToMutable = true;
            } else {
                if (location.belongsTo.id === Client.getClient().entity.id) {
                    location.belongsToMutable = true;
                    location.belongsToCheckbox = true;
                }
            }
        };

        $scope.showErrorBanner = function () {
            if (!$scope.locationErrorAlert) {
                $scope.locationErrorAlert = $alert({
                    content: 'Please correct the below information.',
                    container: '#modal-messages-container',
                    type: 'danger',
                    dismissable: false
                });
            }
        };
    })
;
