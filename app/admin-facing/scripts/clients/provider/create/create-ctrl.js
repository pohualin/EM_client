'use strict';

angular.module('emmiManager')

/**
 *   Used to create new Provider and ClientProvider in one call
 */
    .controller('ClientProviderCreateController', ['$scope', 'ClientProviderService', '$alert', 'Client',
        function ($scope, ClientProviderService, $alert, Client) {

            ClientProviderService.specialtyRefData(Client.getClient()).then(function(response){
                $scope.specialties = response;
            });

            $scope.clientProvider = ClientProviderService.newClientProvider();

            $scope.title = 'New Provider';

            $scope.saveAndAddAnother = function (isValid) {
                $scope.saveProvider(isValid, true);
            };

            if($scope.providerQuery){
                var strings = $scope.providerQuery.split(',');
                if(strings.length > 1){
                    $scope.clientProvider.provider.entity.firstName = strings[1].trim();
                }
                $scope.clientProvider.provider.entity.lastName = strings[0].trim();
            }

            $scope.saveProvider = function (isValid, addAnother) {
                $scope.providerFormSubmitted = true;
                if (isValid) {
                    var toBeSaved = $scope.clientProvider;
                    ClientProviderService.create(Client.getClient(), toBeSaved).then(function (provider) {
                        // reload the existing providers
                        $scope.performSearch();

                        var providerResource = provider.data.provider;
                        $scope.hideNewProviderModal();
                        if (addAnother) {
                            $scope.associateProviders();
                            $alert({
                                content: 'The provider <b>' + providerResource.entity.fullName + '</b> has been successfully created.',
                                container: '#modal-messages-container'
                            });
                        } else {
                            $alert({
                                content: '<b>' + providerResource.entity.fullName + '</b> has been added successfully.'
                            });
                        }
                    });
                    _paq.push(['trackEvent', 'Form Action', 'Client Provider Create', 'Save']);
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

        }])
;
