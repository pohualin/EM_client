'use strict';
angular.module('emmiManager')
/*    .controller('SearchOptionDropDownCtrl', function ($scope, $location) {

        $scope.changehref = function (option) {
            if (option === 'Clients') {
                $location.path('/clients');
            } else if (option === 'Teams') {
                $location.path('/teams');
            } else if (option === 'Providers') {
                $location.path('/providers');
            } else if (option === 'Locations') {
                $location.path('/locations');
            } else if (option === 'Users') {
                $location.path('/users');
            }
        };

    })*/

/**
 * Sorting helper functions
 */
    .controller('CommonSort', ['$scope', function ($scope) {
        $scope.createSortProperty = function (property) {
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
    }])

/**
 * Pagination helper functions
 */
    .controller('CommonPagination', ['$scope', function($scope){

        $scope.pageSizes = [5, 10, 15, 25];

        $scope.isEmpty = function (obj) {
            if (!obj){
                return true;
            }
            return angular.equals({}, obj);
        };

        $scope.handleResponse = function (responsePage, contentProperty) {
            if (responsePage && responsePage.content) {
                // sort the rows the way they exist on the response page
                for (var sort = 0, size = responsePage.content.length; sort < size; sort++ ){
                    var content = responsePage.content[sort];
                    content.sortIdx = sort;
                }
                // put the content in scope
                $scope[contentProperty] = responsePage.content;
                // set the total
                $scope.total = responsePage.page.totalElements;

                // create links in scope
                $scope.links = [];
                for (var i = 0, l = responsePage.linkList.length; i < l; i++) {
                    var aLink = responsePage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        var linkValue = aLink.rel.substring(5);
                        if (linkValue === 'next'){
                            linkValue = '>';
                        } else if (linkValue === 'prev'){
                            linkValue = '<';
                        }
                        $scope.links.push({
                            order: i,
                            name: linkValue,
                            href: aLink.href
                        });
                    }
                }
                $scope[contentProperty].links = $scope.links;
                // create current loading plus page
                $scope.load = responsePage.link.self;

                // page numbers
                $scope.currentPage = responsePage.page.number + 1;
                $scope.currentPageSize = responsePage.page.size;

                // status filter on response
                if (responsePage.filter) {
                    $scope.status = responsePage.filter.status;
                }

                // handle sort response object
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

/**
 * Features of the common search controller are:
 *
 * 1. allows for marshaling to and from an object in the scope for the URI 'search' parameters.
 * 2. Sets common pagination sizes
 * 3. Handles tri-click sorting properties
 * 4. Handles response page pagination and sorting
 */
    .controller('CommonSearch', ['$scope', '$location', '$rootScope', 'arrays', '$controller','URL_PARAMETERS',
            function ($scope, $location, $rootScope, arrays, $controller,URL_PARAMETERS) {

        $controller('CommonPagination', {$scope: $scope});

                $controller('CommonSort', {$scope: $scope});

        // set the proper value in the search chooser based upon the path
        if ($location.path() === '/clients'){
            $scope.option = 'Clients';
        } else if ($location.path() === '/teams'){
            $scope.option = 'Teams';
        } else if ($location.path() === '/providers'){
            $scope.option = 'Providers';
        } else if ($location.path() === '/locations'){
            $scope.option = 'Locations';
        } else if ($location.path() === '/users'){
            $scope.option = 'Users';
        }

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
            // Set $scope.pageWhereBuilt
            switch (searchObject.p) {
            case URL_PARAMETERS.CLIENT:
              $scope.pageWhereBuilt = 'client';
              break;
            case URL_PARAMETERS.TEAM:
              $scope.pageWhereBuilt = 'team';
              break;
            case URL_PARAMETERS.PROVIDER:
              $scope.pageWhereBuilt = 'provider';
              break;
            case URL_PARAMETERS.LOCATION:
              $scope.pageWhereBuilt = 'location';
              break;
            case URL_PARAMETERS.USER:
                $scope.pageWhereBuilt = 'user';
                break;
            default:
              break;
            }
        }
/*

        $scope.serializeToQueryString = function (query, page, status, sort, size){
            var queryObject={};
            queryObject[URL_PARAMETERS.QUERY] = query;
            queryObject[URL_PARAMETERS.PAGE] = page;
            queryObject[URL_PARAMETERS.STATUS] = status;
            queryObject[URL_PARAMETERS.SORT] = sort ? sort.property : '';
            queryObject[URL_PARAMETERS.DIRECTION] = sort ? (sort.ascending ? 'asc' : 'desc') : '';
            queryObject[URL_PARAMETERS.SIZE] = size;

            $location.search(queryObject).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };
*/

    }])
;
