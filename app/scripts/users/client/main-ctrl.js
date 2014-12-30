'use strict';

angular.module('emmiManager')

/**
 * Manage Client Level users
 */
    .controller('UsersClientMainCtrl', ['$scope', '$controller', 'Client', 'UsersClientService', 'TeamsFilter',
        function ($scope, $controller, Client, UsersClientService, TeamService) {

            var contentProperty = 'usersClient';

            /**
             * when the status select is changed
             */
            $scope.statusChange = function () {
                performSearch($scope.query, $scope.status, $scope.sortProperty);
            };

            /**
             * Called when fetching different pages
             */
            $scope.fetchPage = function (href) {
                $scope.loading = true;
                UsersClientService.fetchPage(href).then(function (usersClient) {
                    $scope.handleResponse(usersClient, contentProperty);
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
                performSearch($scope.query, $scope.status, sort);
            };

            /**
             * Called when deactivate is clicked in the table
             *
             * @param userClientResource to be deactivated
             */
            $scope.toggleActivation = function (userClientResource) {
                UsersClientService.toggleActivation(userClientResource);
            };

            /**
             * Called when the team filter is changed
             */
            $scope.onTeamFilterChange = function () {
                performSearch($scope.query, $scope.status, $scope.sortProperty);
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $controller('CommonSearch', {$scope: $scope});
                $scope.client = Client.getClient();
                $scope.page.setTitle('Manage Users - ' + $scope.client.entity.name);
                $scope.searchPerformed = false;

                // See if client has any users at all
                UsersClientService.list($scope.client).then(function (response) {
                    $scope.lookedForUsers = true;
                    $scope.statuses = response.statusFilter;
                    if (response.page.totalElements > 0) {
                        $scope.hasUsers = true;
                    }
                });

                // put the team and tag filter into scope
                $scope.teamTagFilter = {
                    team: null,
                    tag: null
                };

                // load all of the teams for the client
                TeamService.getClientTeams().then(function (teams) {
                    $scope.allTeams = teams;
                });

                // perform search if the query string has search arguments
                if ($scope.query) {
                    if ($scope.pageWhereBuilt === 'user') {
                        // search from the query string, don't blank out status and total for INACTIVE_ONLY searches
                        performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.status !== 'INACTIVE_ONLY');
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
                    $scope.serializeToQueryString(q, 'u', status, sort);
                    UsersClientService.list($scope.client, $scope.query, sort, status, $scope.teamTagFilter.team).then(
                        function success(response) {
                            if (!response) {
                                $scope.sortProperty = sort;
                            }
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
