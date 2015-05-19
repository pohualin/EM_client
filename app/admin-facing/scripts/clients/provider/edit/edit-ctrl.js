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
                    var toBeSaved = $scope.clientProvider;
                    ClientProviderService.update(Client.getClient(), toBeSaved).then(function (response) {
                        var clientProviderResource = response.data;
                        // overwrite original provider with saved one
                        angular.copy(clientProviderResource, $scope.originalClientProvider);
                        $scope.$hide();
                        $alert({
                            title: '',
                            content: 'The provider <b>'+response.data.provider.entity.fullName+'</b> has been successfully updated.',
                            container: '#messages-container',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    });
                    _paq.push(['trackEvent', 'Form Action', 'Client Provider Edit', 'Save']);
                } else {
                    if (!$scope.providerErrorAlert) {
                        $scope.providerErrorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#modal-messages-container',
                            type: 'danger',
                            show: true,
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
