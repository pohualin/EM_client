'use strict';

angular.module('emmiManager')


/**
 *  Controls the new provider search/select popup
 */
    .controller('ClientAssociateProviderSearchController', ['$controller', '$scope', 'ClientProviderService', 'Client', '$alert', 'ProviderSearch',
        function ($controller, $scope, ClientProviderService, Client, $alert, ProviderSearch) {

            $controller('CommonPagination', {$scope: $scope});

            $scope.pageSizes = [5, 10, 15, 25];

            var managedProviderList = 'providers';

            ProviderSearch.getReferenceData().then(function (refData) {
                $scope.statuses = refData.statusFilter;
            });

            /**
             * Called when the checkbox on the select popup is checked or unchecked
             * @param providerResource it was checked on
             */
            $scope.onCheckboxChange = function (providerResource) {
                if (providerResource.entity.newprovider) {
                    // checked
                    $scope.changedProviders[providerResource.entity.id] = angular.copy(providerResource);
                } else {
                    // unchecked
                    delete $scope.changedProviders[providerResource.entity.id];
                }
            };

            $scope.setCheckboxesForChanged = function(providers) {
                angular.forEach(providers, function(clientProvider){
                    clientProvider.provider.entity.newprovider = $scope.changedProviders[clientProvider.provider.entity.id] ? true : false;
                });
            };

            /**
             * Adds providers to the client
             * @param addAnother whether or not we're going to add more after this save
             */
            $scope.save = function (addAnother) {
                var newClientProviders = [];

                angular.forEach($scope.changedProviders, function (providerResource) {
                    newClientProviders.push(providerResource.entity);
                });
                // save the new providers
                return ClientProviderService.addProvidersToClient(Client.getClient(), newClientProviders).then(function () {
                    // reload the existing providers
                    $scope.performSearch();

                    if (newClientProviders.length === 1) {
                        $scope.singleProviderAdded = newClientProviders[0];
                    } else {
                        delete $scope.singleProviderAdded;
                    }

                    // close the modal and show the message
                    if (!addAnother) {
                        $scope.$hide();
                        var message = ($scope.singleProviderAdded) ?
                            ' <b>' + $scope.singleProviderAdded.firstName + ' ' + $scope.singleProviderAdded.middleName + ' ' + $scope.singleProviderAdded.lastName + '</b> has been added successfully.' :
                            'The selected providers have been added successfully.';
                        $alert({
                            title: ' ',
                            content: message,
                            container: '#messages-container',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    }
                });
            };

            $scope.saveAndAddAnother = function () {
                $scope.save(true).then(function () {
                    $scope.providerQuery = null;
                    $scope.status = null;
                    $scope.searchPerformed = false;
                    $scope.changedProviders = {};
                    $scope[managedProviderList] = null;
                    focus('ProviderSearchFocus');
                    var clientName = (Client.getClient().entity.name) ? '<b>' + Client.getClient().entity.name + '</b>.' : 'the client.',
                        message = (!$scope.singleProviderAdded) ? 'The selected providers were successfully added to ' + clientName :
                            'The provider <b>' + $scope.singleProviderAdded.firstName + ' ' + $scope.singleProviderAdded.middleName + ' ' + $scope.singleProviderAdded.lastName + '</b> has been successfully added to ' + clientName;
                    $alert({
                        title: ' ',
                        content: message,
                        container: '#modal-messages-container',
                        type: 'success',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
            };

            $scope.cancel = function () {
                // close the window without doing anything
                $scope.$hide();
            };

            $scope.search = function (validForm) {
                if (validForm) {
                    $scope.changedProviders = {};
                    $scope.loading = true;
                    ClientProviderService.find(Client.getClient(), $scope.providerQuery).then(function (providerPage) {
                        $scope.handleResponse(providerPage, managedProviderList);
                        $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                    }, function () {
                        // error happened
                        $scope.loading = false;
                    });
                }
            };

            $scope.statusChange = function () {
                $scope.loading = true;
                ClientProviderService.find(Client.getClient(), $scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProviderList);
                    $scope.setCheckboxesForChanged($scope[managedProviderList]);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

            $scope.fetchPage = function (href) {
                $scope.loading = true;
                ClientProviderService.fetchPageLink(href).then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProviderList);
                    $scope.setCheckboxesForChanged($scope[managedProviderList]);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

            $scope.changePageSize = function (pageSize) {
                $scope.loading = true;
                ClientProviderService.find(Client.getClient(), $scope.providerQuery, $scope.status, $scope.sortProperty, pageSize).then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProviderList);
                    $scope.setCheckboxesForChanged($scope[managedProviderList]);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

            // when a column header is clicked
            $scope.sort = function (property) {
                var sort = $scope.sortProperty || {};
                if (sort && sort.property === property) {
                    // same property was clicked
                    if (!sort.ascending) {
                        // third click removes sort
                        sort = null;
                    } else {
                        // switch to descending
                        sort.ascending = false;
                    }
                } else {
                    // change sort property
                    sort.property = property;
                    sort.ascending = true;
                }
                $scope.loading = true;
                ClientProviderService.find(Client.getClient(), $scope.providerQuery, $scope.status, sort, $scope.currentPageSize).then(function (providerPage) {
                    $scope.handleResponse(providerPage, managedProviderList);
                    $scope.setCheckboxesForChanged($scope[managedProviderList]);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

        }])
;
