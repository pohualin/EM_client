'use strict';

angular.module('emmiManager')

/**
 * Search users across all clients
 */
.controller('ClientUsersSupportSearchCtrl', ['$scope', '$controller', 'URL_PARAMETERS', 'STATUS', 'ClientUsersSupportService', 
    function ($scope, $controller, URL_PARAMETERS, STATUS, ClientUsersSupportService) {
    
        var contentProperty = 'clientUsers';
        
        /**
         * Called when fetching different pages
         */
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ClientUsersSupportService.fetchPage(href).then(function (clientUsers) {
                $scope.handleResponse(clientUsers, contentProperty);
            }, function () {
                $scope.loading = false;
            });
        };
        
        /**
         * Called when GO button is clicked
         */
        $scope.search = function () {
            performSearch($scope.query, null, null, true);
        };
        
        /**
         * Called when column header is clicked to change sorting property
         */
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            performSearch($scope.query, $scope.status, sort, false);
        };
        
        /**
         * when the status select is changed
         */
        $scope.statusChange = function () {
            performSearch($scope.query, $scope.status, $scope.sortProperty, false);
        };
        
        /**
         * init method called when page is loading
         */
        function init() {
            $controller('CommonSearch', {$scope: $scope});
            
            $scope.page.setTitle('Search Client Users');
            $scope.searchPerformed = false;
            
            ClientUsersSupportService.getReferenceData().then(function(refData) {
                $scope.statuses = refData.statusFilter;
            });
            
            // perform search if the query string has search arguments
            if ($scope.query) {
                if ($scope.pageWhereBuilt === URL_PARAMETERS.CLIENT_USERS) {
                    // search from the query string, don't blank out status and total for INACTIVE_ONLY searches
                    performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.status !== STATUS.INACTIVE_ONLY);
                } else {
                    // it was built by a different page, use the query only
                    performSearch($scope.query, null, null, true);
                }
            }
        }
        
        /**
         * Performs a search via the service layer and handles persistence to
         * the query string
         *
         * @param q the query
         * @param status to filter by
         * @param sort to sort by
         * @param recalculateStatusFilterAndTotal boolean indicating whether the
         *        status and filter line should be possibly blanked out or not
         *        true means to possibly blank it out, false means leave it the
         *        way it is
         */
        function performSearch(q, status, sort, recalculateStatusFilterAndTotal) {
            if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
                $scope.loading = true;
                $scope.serializeToQueryString(q, URL_PARAMETERS.CLIENT_USERS, status, sort);
        
                ClientUsersSupportService.list(
                    $scope.query, sort, status).then(
                    function success(response) {
                        if (!response) {
                            // leave the existing sort, since one didn't come back
                            $scope.sortProperty = sort;
                            
                        }
                        
                        // common paginated response handling
                        $scope.handleResponse(response, contentProperty);
        
                        if (recalculateStatusFilterAndTotal) {
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }
                    }, function failure() {
                        $scope.loading = false;
                    });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
                _paq.push(['trackSiteSearch', q, 'Client User Search']);
            }
        }
        
        init();
    }]);
