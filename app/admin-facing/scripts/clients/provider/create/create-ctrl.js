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
                                title: ' ',
                                content: 'The provider <b>' + providerResource.entity.fullName + '</b> has been successfully created.',
                                container: '#modal-messages-container',
                                type: 'success',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        } else {
                            $alert({
                                title: ' ',
                                content: ' <b>' + providerResource.entity.fullName + '</b> has been added successfully.',
                                container: '#messages-container',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }
                    });
                    _paq.push(['trackEvent', 'Form Action', 'Client Provider Create', 'Save']);
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
        }])
;
