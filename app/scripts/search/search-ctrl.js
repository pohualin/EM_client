'use strict';
angular.module('emmiManager')
    .controller('SearchOptionDropDownCtrl', function ($scope, $location) {

        $scope.changehref = function (option) {
            if (option === 'Clients') {
                $location.path('/clients');
            }
            if (option === 'Teams') {
                $location.path('/teams');
            }
        };

    })

/**
 * Features of the common search controller are:
 *
 * 1. allows for marshaling to and from an object in the scope for the URI 'search' parameters.
 * 2. Sets common pagination sizes
 * 3. Handles tri-click sorting properties
 * 4. Handles response page pagination and sorting
 */
    .controller('CommonSearch', ['$scope', '$location', '$rootScope', 'arrays', function ($scope, $location, $rootScope, arrays) {

        // set the proper value in the search chooser based upon the path
        if ($location.path() === '/clients'){
            $scope.option = 'Clients';
        } else if ($location.path() === '/teams'){
            $scope.option = 'Teams';
        }

        $scope.pageSizes = [5, 10, 15, 25];

        // when first loading the page
        var searchObject = $location.search();
        if (searchObject && searchObject.q) {
            $scope.query = searchObject.q;
            $scope.status = searchObject.status;

            // page size validation
            if (searchObject.size) {
                // ignore a page size not within the 'pageSizes'
                angular.forEach($scope.pageSizes, function (pageSize) {
                    // cast to string to allow for === comparison
                    if ('' + pageSize === searchObject.size) {
                        $scope.currentPageSize = searchObject.size;
                    }
                });
            }
            $scope.sortProperty = {};
            if (searchObject.sort) {
                $scope.sortProperty.property = searchObject.sort;
                if (searchObject.dir) {
                    if (searchObject.dir === 'asc') {
                        $scope.sortProperty.ascending = true;
                    } else if (searchObject.dir === 'desc') {
                        $scope.sortProperty.ascending = false;
                    }
                }
            }
            $scope.pageWhereBuilt = searchObject.p === 'c' ? 'client' : 'team';
        }

        $scope.serializeToQueryString = function (query, page, status, sort, size){
            $location.search({
                q: query,
                p: page,
                status: status,
                sort: sort ? sort.property : '',
                dir: sort ? (sort.ascending ? 'asc' : 'desc') : '',
                size: size
            }).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.createSortProperty = function (property){
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
            return sort;
        };

        $scope.handleResponse = function (responsePage, contentProperty) {
            if (responsePage) {
                for (var sort = 0, size = responsePage.content.length; sort < size; sort++ ){
                    var content = responsePage.content[sort];
                    content.sortIdx = sort;
                }

                $scope[contentProperty] = responsePage.content;

                $scope.total = responsePage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = responsePage.linkList.length; i < l; i++) {
                    var aLink = responsePage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = responsePage.link.self;
                $scope.currentPage = responsePage.page.number;
                $scope.currentPageSize = responsePage.page.size;
                $scope.status = responsePage.filter.status;
                if (responsePage.sort) {
                    $scope.sortProperty = {
                        property: responsePage.sort[0].property,
                        ascending: responsePage.sort[0].direction === 'ASC'
                    };
                }
            } else {
                $scope.total = 0;
                $scope[contentProperty] = null;
            }
            $scope.searchPerformed = true;
            $scope.loading = false;
        };
    }])
;