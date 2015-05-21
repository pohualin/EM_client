'use strict';

angular.module('emmiManager')

/**
 * Responsible for what you can do on an existing ClientProvider (e.g. edit, remove, etc)
 */
    .controller('ClientCurrentProvidersOperationController', ['$scope', '$modal', '$alert', 'ClientProviderService',
        function ($scope, $modal, $alert, ClientProviderService) {

            var editProviderModal = $modal({
                scope: $scope,
                template: 'admin-facing/partials/client/provider/edit.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });

            $scope.editProvider = function (clientProvider) {
                // create a copy for editing
                $scope.clientProvider = angular.copy(clientProvider);

                // save the original for overlay if save is clicked
                $scope.originalClientProvider = clientProvider;

                // show the dialog box
                editProviderModal.$promise.then(editProviderModal.show);
            };

            $scope.showRemovalSuccess = function (providerResource) {
                $alert({
                    content: 'The provider <b>' + providerResource.provider.entity.fullName + '</b> has been successfully removed.'
                });
            };

            $scope.removeExistingProvider = function (providerResource) {
                ClientProviderService.removeProvider(providerResource).then(function () {
                    $scope.showRemovalSuccess(providerResource);
                    $scope.performSearch();
                });
            };
        }])
;
