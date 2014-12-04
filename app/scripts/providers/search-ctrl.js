'use strict';

angular.module('emmiManager')
    .controller(
        'ProvidersSearchController',
        function($scope, $controller, $location, Client, ProviderSearch, ProviderService) {

            // when a pagination link is used
            $scope.fetchPage = function(href) {
                $scope.loading = true;
                ProviderSearch.fetchPage(href).then(function(providerData) {
                    $scope.handleResponse(providerData, 'providers');
                }, function() {
                    // error happened
                    $scope.loading = false;
                });
            };

            $scope.search = function() {
                performSearch($scope.query, null, null, null, true);
            };

            $scope.sort = function(property) {
                var sort = $scope.createSortProperty(property);
                performSearch($scope.query, $scope.status, sort,
                    $scope.currentPageSize);
            };

            $scope.statusChange = function() {
                performSearch($scope.query, $scope.status, $scope.sortProperty,
                    $scope.currentPageSize);
            };

            // Function declarations start here
            function init() {
                // Inject CommonSearch
                $controller('CommonSearch', {
                    $scope: $scope
                });

                // Getting status reference data form Client service
                Client.getReferenceData().then(function(refData) {
                    $scope.statuses = refData.statusFilter;
                });

                // Initiate a search when $scope.query is not empty
                if ($scope.query) {
                    if ($scope.pageWhereBuilt === 'provider') {
                        performSearch($scope.query, $scope.status, $scope.sortProperty,
                            $scope.currentPageSize, $scope.status !== 'INACTIVE_ONLY');
                    } else {
                        // it was built by a different page, use the query only
                        performSearch($scope.query, null, null, null, true);
                    }
                }
            }

            function performSearch(q, status, sort, size,
                recalculateStatusFilterAndTotal) {
                if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
                    $scope.loading = true;
                    $scope.serializeToQueryString(q, 'p', status, sort, size);
                    ProviderSearch.search(q, status, sort, size).then(
                        function(providerData) {
                            $scope.handleResponse(providerData, 'providers');
                            if (recalculateStatusFilterAndTotal) {
                                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                            }
                        }, function() {
                            // error happened
                            $scope.loading = false;
                        });
                    // turn off the sort after the search request has been made, the
                    // response will rebuild
                    $scope.sortProperty = null;
                }
            }
            // Function declarations end here

            init();
        });
