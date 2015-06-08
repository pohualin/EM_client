'use strict';
angular.module('emmiManager')

    .controller('ProviderSearchController', function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, ClientProviderService, Client, focus) {

        $controller('CommonSearch', {$scope: $scope});

        var searchedProvidersList = 'searchedProvidersList';
        var managedClientProviderList = 'clientProviders';

        /**
         * Called when search button is clicked from search all provider tab
         */
        $scope.search = function (isValid) {
            if (isValid) {
                $scope.noSearch = false;
                ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.searchAll.providerQuery, $scope.searchAll.status)
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
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.searchAll.providerQuery, $scope.searchAll.status)
            .then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
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

        /**
         * Called when a column header in search all provider result table is clicked.
         */
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            $scope.loading = true;
            ClientProviderService.findPossibleProvidersNotUsingClient($scope.allTeamLocations, Client.getClient(), $scope.searchAll.providerQuery, $scope.searchAll.status, sort, $scope.currentPageSize)
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
            var sort = $scope.createSortProperty(property);
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
            } else {
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
                if ($scope.teamProviders[provider.provider.entity.id] ) {
                    $scope.teamProviders[provider.provider.entity.id].isNewAdd = false;
                    $scope.teamProviders[provider.provider.entity.id].disabled = true;
                    $scope.teamProviders[provider.provider.entity.id].checked = true;
                    $scope.teamProviders[provider.provider.entity.id].associated = true;
                    provider.provider.entity.isNewAdd = false;
                    provider.provider.entity.disabled = true;
                    provider.provider.entity.checked = true;

                    // check 'all' of the team locations
                    provider.provider.entity.selectedTeamLocations = angular.copy($scope.allTeamLocations);
                }
            });
        };

        $scope.cleanSearch = function() {
            $scope.searchedProvidersList = [];
            $scope.noSearch = true;
            $scope.links = [];
            $scope.searchAll.providerQuery = null;
        };

        $scope.saveAssociationAndAddAnotherProvider = function () {
            $scope.associateSelectedProvidersToTeam(true).then(function (providersToAdd) {
                $scope.refreshLocationsAndProviders().then(function () {
                    $scope.successAlert(providersToAdd, '#modal-messages-container');
                    $scope.resetState();
                    // if on the client providers tab
                    if ($scope.tabs.activeTab === 0) {
                        // disable previously selected providers
                        $scope.setClientProviderSelected($scope.clientProviders);
                    }
                    // set the active tab to search per UAT ticket EM-1029
                    $scope.tabs.activeTab = 1;
                    $scope.cleanSearch();
                    focus('ProviderSearchFocus');
                });
            });
        };

        $scope.associateSelectedProvidersToTeam = function (addAnother) {
            $scope.associateRequestSubmitted = true;
            if ($scope.teamProviderTeamLocationSaveRequest.length > 0) {
                var invalidRequest = false;
                angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(req){
                    if ($scope.allTeamLocations.length > 0 && req.provider.selectedTeamLocations.length < 1) {
                        invalidRequest = true;
                    }
                });
                if (!invalidRequest) {
                    // copy the selected team locations when 'all' has not been chosen
                    angular.forEach($scope.teamProviderTeamLocationSaveRequest, function(req){
                        if (req.provider.selectedTeamLocations.length !== $scope.allTeamLocations.length) {
                            // user didn't choose all team locations
                            req.teamLocations = angular.copy(req.provider.selectedTeamLocations);
                        } else {
                            // user chose all, which is the same as not selecting any
                            req.teamLocations = [];
                        }
                    });
                    return ProviderSearch.updateProviderTeamAssociations($scope.teamProviderTeamLocationSaveRequest, $scope.teamResource).then(function (response) {
                        if (!addAnother) {
                            $scope.successAlert($scope.teamProviderTeamLocationSaveRequest, '#messages-container');
                            $scope.hideaddprovidermodal(); // this also resets $scope.teamProviderTeamLocationSaveRequest
                            $scope.refreshLocationsAndProviders();
                        }
                        return $scope.teamProviderTeamLocationSaveRequest;
                    });
                }
            }
        };

        function init() {
        	$scope.searchAll.status = 'ACTIVE_ONLY';
            ClientProviderService.findForClient(Client.getClient()).then(function (clientProviders) {
                $scope.handleResponse(clientProviders, managedClientProviderList);
                $scope.setClientProviderSelected($scope.clientProviders);
            });
            $scope.cleanSearch();
            $scope.tabs = TeamProviderService.setAllTabs();
        }
        init();
    })
;
