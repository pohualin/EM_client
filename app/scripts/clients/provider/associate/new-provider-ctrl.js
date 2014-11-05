'use strict';

angular.module('emmiManager')


/**
 *  Controls the new provider search/select popup
 */
    .controller('ClientAssociateNewProviderController', ['$scope', '$modal',
        function ($scope, $modal) {

            var newProviderModal = $modal({
                scope: $scope,
                template: 'partials/client/provider/create.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });

            $scope.createNewProvider = function () {
                $scope.$hide();
                newProviderModal.$promise.then(newProviderModal.show);
            };

            $scope.hideNewProviderModal = function () {
                newProviderModal.$promise.then(newProviderModal.destroy);
            };
        }])
;