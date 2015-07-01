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
                $scope.status = STATUS.ACTIVE_ONLY;
                performSearch($scope.query, null, null);
            };

            /**
             * Called when column header is clicked to change sorting property
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                performSearch($scope.query, $scope.status, sort);
            };

            /**
             * when the status select is changed
             */
            $scope.statusChange = function () {
                performSearch($scope.query, $scope.status, $scope.sortProperty);
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $controller('CommonSearch', {$scope: $scope});

                $scope.page.setTitle('Search Client Users | ClientManager');
                $scope.searchPerformed = false;

                ClientUsersSupportService.getReferenceData().then(function (refData) {
                    $scope.statuses = refData.statusFilter;
                });

                // perform search if the query string has search arguments
                if ($scope.query) {
                    if ($scope.pageWhereBuilt === URL_PARAMETERS.CLIENT_USERS) {
                        performSearch($scope.query, $scope.status, $scope.sortProperty);
                    } else {
                        // it was built by a different page, use the query only
                        $scope.status = STATUS.ACTIVE_ONLY;
                        performSearch($scope.query, $scope.status, null);
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
             */
            function performSearch(q, status, sort) {
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
