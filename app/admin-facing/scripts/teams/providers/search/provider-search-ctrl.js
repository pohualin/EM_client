'use strict';
angular.module('emmiManager')

    .controller('ProviderSearchController', function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client) {

        $controller('CommonPagination', {$scope: $scope});

        var searchedProvidersList = 'searchedProvidersList';

        /**
         * Called when search button is clicked from search all provider tab
         */
        $scope.search = function (isValid) {
            if (isValid) {
                $scope.noSearch = false;
                ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status)
                .then(function (providerPage) {
                    $scope.handleResponse(providerPage, 'searchedProvidersList');
                });
            }
        };

        /**
         * Called when status changed
         */
        $scope.statusChange = function () {
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status)
            .then(function (providerPage) {
                var provPage = angular.isObject(providerPage) ? angular.extend({}, providerPage) : {statusFromReq:$scope.status};
                $scope.handleResponse(provPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Called to fetch another page of possible providers by given href
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Fetch next/previous page in Client Providers tab
         */
        $scope.fetchPageClientProviders = function (href) {
            $scope.loading = true;
            ProviderSearch.fetchPageLink(href).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'clientProviders');
                $scope.setClientProviderSelected($scope.clientProviders);
            }, function () {
                $scope.loading = false;
            });
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property) {
                if (this.property === property) {
                    if (!this.resetOnNextSet) {
                        if (this.ascending !== null) {
                            // this property has already been sorted on once
                            // the next click after this one should turn off the sort
                            this.resetOnNextSet = true;
                        }
                        this.ascending = !this.ascending;
                    } else {
                        this.reset();
                    }
                } else {
                    this.property = property;
                    this.ascending = true;
                    this.resetOnNextSet = false;
                }
            },
            reset: function () {
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        /**
         * Called when a column header in search all provider result table is clicked.
         */
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
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.providerQuery, $scope.status, sort, $scope.currentPageSize)
            .then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };
        
        /**
         * Called when a column header in client providers result table is clicked.
         */
        $scope.sortClientProviders = function (property) {
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
            ClientProviderService.findForClient(Client.getClient(), sort).then(function (clientProviders) {
                $scope.handleResponse(clientProviders, managedClientProviderList);
                $scope.setClientProviderSelected($scope.clientProviders);
            }, function(){
                // error happened
                $scope.loading = false;
            });
        };

        /**
         * Called when check box checked or unchecked from both tabs
         */
        $scope.onCheckboxChange = function (provider) {
            var request = {};
            request.teamLocations = [];
            provider.entity.teamLocations = [];

            if (provider.entity.checked) {
                provider.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
                if (provider.entity.selectedTeamLocations.length > 0) {
                    provider.entity.showLocations = true;
                }
                request.provider = provider.entity;
                $scope.teamProviderTeamLocationSaveRequest.push(request);
            }
            else {
                provider.entity.showLocations = false;
                request.provider = provider.entity;
                $scope.teamProviderTeamLocationSaveRequest.splice(request.provider.entity, 1);
            }
        };

        $scope.setCheckboxesForChanged = function (providers) {
            angular.forEach(providers, function (searchedTeamProvider) {
                angular.forEach($scope.teamProviderTeamLocationSaveRequest, function (teamProviderInRequest) {
                    if (teamProviderInRequest.provider.id === searchedTeamProvider.provider.entity.id) {
                        searchedTeamProvider.provider.entity.checked = true;
                    }
                });
            });
        };

        /**
         * Method to manipulate check boxes in Client Providers tab
         */
        $scope.setClientProviderSelected = function (providers) {
            angular.forEach(providers, function (provider) {
                if ($scope.teamProviders[provider.provider.entity.id]) {
                    $scope.teamProviders[provider.provider.entity.id].isNewAdd = false;
                    $scope.teamProviders[provider.provider.entity.id].disabled = true;
                    $scope.teamProviders[provider.provider.entity.id].checked = true;
                    $scope.teamProviders[provider.provider.entity.id].associated = true;
                    provider.provider.entity.isNewAdd = false;
                    provider.provider.entity.disabled = true;
                    provider.provider.entity.checked = true;
                }
            });
        };

        var managedClientProviderList = 'clientProviders';
        ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
            $scope.handleResponse(clientProviders, managedClientProviderList);
            $scope.setClientProviderSelected($scope.clientProviders);
        });
        $scope.tabs = TeamProviderService.setAllTabs($scope.addAnother);
    })
;
