'use strict';

angular.module('emmiManager')
    .controller(
        'ProvidersSearchController',
    function ($scope, $controller, $location, URL_PARAMETERS, STATUS, Client, ProviderSearch) {

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
                    if ($scope.pageWhereBuilt === URL_PARAMETERS.PROVIDER) {
                        performSearch($scope.query, $scope.status, $scope.sortProperty,
                            $scope.currentPageSize, $scope.status !== STATUS.INACTIVE_ONLY);
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
                    $scope.serializeToQueryString(q, URL_PARAMETERS.PROVIDER, status, sort, size);
                    ProviderSearch.searchFromHomePage(q, status, sort, size).then(
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
                    _paq.push(['trackSiteSearch', q, 'Provider Search']);
                }
            }
            // Function declarations end here

            init();
        });
