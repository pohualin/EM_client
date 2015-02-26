'use strict';
angular.module('emmiManager')

    .controller('ProviderSearchController', function ($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays, ProviderCreate, $alert) {

        $controller('CommonPagination', {$scope: $scope});

        var searchedProvidersList = 'searchedProvidersList';

        $scope.search = function (isValid) {
            if (isValid) {
                $scope.noSearch = false;
                ProviderSearch.search($scope.allTeamLocations, $scope.teamResource, $scope.providerQuery, $scope.status).then(function (providerPage) {
                    $scope.handleResponse(providerPage, 'searchedProvidersList');
                });
            }
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            ProviderSearch.search($scope.allTeamLocations, $scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

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

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            ProviderSearch.search($scope.allTeamLocations, $scope.teamResource, $scope.providerQuery, $scope.status, $scope.sortProperty, pageSize).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
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
            ProviderSearch.search($scope.allTeamLocations, $scope.teamResource, $scope.providerQuery, $scope.status, sort, $scope.currentPageSize).then(function (providerPage) {
                $scope.handleResponse(providerPage, 'searchedProvidersList');
                $scope.setCheckboxesForChanged($scope[searchedProvidersList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

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

    })
;