'use strict';

angular.module('emmiManager')

/**
 *   Pops a modal containing the search window
 */
    .controller('ClientOpenProviderAssociateOperationController', ['$scope', '$modal', function ($scope, $modal) {

        var addProviderAssociationModal = $modal({
            scope: $scope,
            template: 'partials/client/provider/associate.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });

        $scope.associateProviders = function () {
            $scope.searchPerformed = false;
            addProviderAssociationModal.$promise.then(addProviderAssociationModal.show);
        };

        $scope.hideProviderAssociationModal = function () {
            addProviderAssociationModal.hide();
        };
    }])
;