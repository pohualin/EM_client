'use strict';

angular.module('emmiManager')

/**
 *  Show list of clients
 */
    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate, $controller) {

        $controller('ViewEditCommon', {$scope: $scope});

        $controller('CommonSearch', {$scope: $scope});

        var contentProperty = 'clients';

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        var performSearch = function(q, status, sort, size, recalculateStatusFilterAndTotal){
            if (!$scope.searchForm || !$scope.searchForm.query.$invalid ) {
                $scope.loading = true;
                $scope.serializeToQueryString(q, 'c', status, sort, size);
                Client.find(q, status, sort, size).then(function (clientPage) {
                    $scope.handleResponse(clientPage, contentProperty);
                    if (recalculateStatusFilterAndTotal) {
                        $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                    }
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
                _paq.push(['trackSiteSearch', q, 'Client Search']);
            }
        };

        // when the search button is used
        $scope.search = function () {
            performSearch($scope.query, null, null, null, true);
        };

        // when first loading the page, via SearchUriPersistence set variables
        if ($scope.query) {
            if ($scope.pageWhereBuilt === 'client') {
                performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize,
                        $scope.status !== 'INACTIVE_ONLY');
            } else {
                // it was built by a different page, use the query only
                performSearch($scope.query, null, null, null, true);
            }
        }

        // when the status change select changes
        $scope.statusChange = function () {
            performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize);
        };

        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            performSearch($scope.query, $scope.status, $scope.sortProperty, pageSize);
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            performSearch($scope.query, $scope.status, sort, $scope.currentPageSize);
        };

        // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Client.fetchPage(href).then(function (clientPage) {
                $scope.handleResponse(clientPage, contentProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

    })
;
