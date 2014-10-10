'use strict';

angular.module('emmiManager')

/**
 *  Show list of clients
 */
    .controller('ClientListCtrl', function ($scope, Client, $http, Session, UriTemplate, $controller, $location) {

        $controller('ViewEditCommon', {$scope: $scope});

        $scope.option = 'Clients';

        $scope.pageSizes = [5, 10, 15, 25];

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        var performSearch = function(q, status, sort, size, recalculateStatusFilterAndTotal){
            if (!$scope.searchForm || !$scope.searchForm.query.$invalid ) {
                $scope.loading = true;
                $location.search({
                    q: q,
                    p: 'c',
                    status: status,
                    sort: sort ? sort.property : '',
                    dir: sort ? (sort.ascending ? 'asc' : 'desc') : '',
                    size: size
                }).replace();
                Client.find(q, status, sort, size).then(function (clientPage) {
                    $scope.handleResponse(clientPage, 'clients');
                    if (recalculateStatusFilterAndTotal) {
                        $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                    }
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            }
        };

        // when the search button is used
        $scope.search = function () {
            performSearch($scope.query, null, null, null, true);
        };

        // when first loading the page
        var searchObject = $location.search();
        if (searchObject && searchObject.q){
            $scope.query = searchObject.q;
            if (searchObject.p === 'c'){
                // the query string was built by the client page
                $scope.status = searchObject.status;

                // page size validation
                if (searchObject.size) {
                    // ignore a page size not allowed by this page
                    angular.forEach($scope.pageSizes, function(pageSize){
                        if ('' + pageSize === searchObject.size){
                            $scope.currentPageSize = searchObject.size;
                        }
                    });
                }
                // sort
                $scope.sortProperty = {};
                if (searchObject.sort) {
                    $scope.sortProperty.property =  searchObject.sort;
                    if (searchObject.dir){
                        if (searchObject.dir === 'asc'){
                            $scope.sortProperty.ascending = true;
                        } else if (searchObject.dir === 'desc'){
                            $scope.sortProperty.ascending = false;
                        }
                    }
                }
                performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize, true);
            } else {
                // it was built by a different page, only use the query
                performSearch($scope.query, null, null, null, true);
            }
        }

        // when the status change select changes
        $scope.statusChange = function () {
            performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize, false);
        };

        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            performSearch($scope.query, $scope.status, $scope.sortProperty, pageSize, false);
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
            $scope.sortProperty = null; // it will be reset when a response comes back
            performSearch($scope.query, $scope.status, sort, $scope.currentPageSize, false);
        };

        // render the response
        $scope.handleResponse = function (entityPage, scopePropertyNameForEntity) {
            if (entityPage) {
                for (var sort = 0, size = entityPage.content.length; sort < size; sort++) {
                    var content = entityPage.content[sort];
                    content.sortIdx = sort;
                }
                this[scopePropertyNameForEntity] = entityPage.content;

                $scope.total = entityPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = entityPage.linkList.length; i < l; i++) {
                    var aLink = entityPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = entityPage.link.self;
                $scope.currentPage = entityPage.page.number;
                $scope.currentPageSize = entityPage.page.size;
                $scope.status = entityPage.filter.status;
                if (entityPage.sort) {
                    $scope.sortProperty = {
                        property: entityPage.sort[0].property,
                        ascending: entityPage.sort[0].direction === 'ASC'
                    };
                }
            } else {
                this[scopePropertyNameForEntity] = null;
                $scope.total = 0;
            }
            $scope.searchPerformed = true;
            $scope.loading = false;
        };

        // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Client.fetchPage(href).then(function (clientPage) {
                $scope.handleResponse(clientPage, 'clients');
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

    })
;