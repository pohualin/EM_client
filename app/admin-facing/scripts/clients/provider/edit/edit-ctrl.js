'use strict';

angular.module('emmiManager')

/**
 *   Used to create new Provider and ClientProvider in one call
 */
    .controller('ClientProviderEditController', ['$scope', 'ClientProviderService', '$alert', 'Client',
        function ($scope, ClientProviderService, $alert, Client) {
            ClientProviderService.specialtyRefData(Client.getClient()).then(function(response){
                $scope.specialties = response;
            });

            $scope.title = 'Edit Provider';

            $scope.saveProvider = function (isValid) {
                $scope.providerFormSubmitted = true;
                if (isValid) {
                    $scope.whenSaving = true;
                    var toBeSaved = $scope.clientProvider;
                    ClientProviderService.update(Client.getClient(), toBeSaved).then(function (response) {
                        var clientProviderResource = response.data;
                        // overwrite original provider with saved one
                        angular.copy(clientProviderResource, $scope.originalClientProvider);
                        $scope.$hide();
                        $alert({
                            content: 'The provider <b>'+response.data.provider.entity.fullName+'</b> has been successfully updated.'
                        });
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                    _paq.push(['trackEvent', 'Form Action', 'Client Provider Edit', 'Save']);
                } else {
                    if (!$scope.providerErrorAlert) {
                        $scope.providerErrorAlert = $alert({
                            content: 'Please correct the below information.',
                            container: '#modal-messages-container',
                            type: 'danger',
                            placement: '',
                            duration: false,
                            dismissable: false
                        });
                    }
                }
            };

            $scope.doNotDeactivateProvider = function(){
                $scope.clientProvider.provider.entity.active = true;
            };
        }
    ])
;
