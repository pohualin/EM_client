'use strict';

angular.module('emmiManager')

/**
 * Manage Client Level users
 */
    .controller('UsersClientMainCtrl', ['$scope', '$controller', 'Client', 'UsersClientService', '$alert',
        function ($scope, $controller, Client, UsersClientService, $alert) {

            var contentProperty = 'usersClient';

            /**
             * when the status select is changed
             */
            $scope.statusChange = function () {
                performSearch($scope.query, $scope.status, $scope.sortProperty, false, $scope.teamTagFilter);
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
                performSearch($scope.query, $scope.status, sort, false, $scope.teamTagFilter);
            };

            /**
             * Called when deactivate is clicked in the table
             *
             * @param userClientResource to be deactivated
             */
            $scope.toggleActivation = function (userClientResource) {
                $scope.whenSaving = true;
                UsersClientService.toggleActivation(userClientResource).then(function (){
                    var message = 'User <strong>' + userClientResource.entity.login + '</strong>';
                    // status has changed
                    if (userClientResource.entity.active){
                        // now activated
                        message += ' is now active.';
                    } else {
                        // now deactivated
                        message += ' has been deactivated.';
                    }
                    $alert({
                        content: message
                    });
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };

            /**
             * This is called when the popover for is toggled
             */
            $scope.deactivationPopoverOpen = function (userClientResource, isOpen) {
                UsersClientService.deactivatePopoverOpen(userClientResource, isOpen);
            };

            /**
             * Called when the team filter is changed
             */
            $scope.onTeamFilterChange = function () {
                performSearch($scope.query, $scope.status, $scope.sortProperty, false, $scope.teamTagFilter);
            };

            /**
             * Called when the tag filter is changed
             */
            $scope.onTagFilterChange = function () {
                // update team filter options to be only teams valid for the currently selected tag
                UsersClientService.findTeamsValidForFilter($scope.teamTagFilter).then(function (teams) {
                    $scope.teamsWithinTag = teams;
                });
                performSearch($scope.query, $scope.status, $scope.sortProperty, false, $scope.teamTagFilter);
            };

            /**
             * init method called when page is loading
             */
            function init() {
                $controller('CommonSearch', {$scope: $scope});
                $scope.client = Client.getClient();
                $scope.page.setTitle('Manage Users - ' + $scope.client.entity.name + ' | ClientManager');
                $scope.searchPerformed = false;

                // See if client has any users at all
                UsersClientService.list($scope.client).then(function (response) {
                    $scope.lookedForUsers = true;
                    $scope.statuses = response.statusFilter;
                    $scope.hasUsers = response.page && response.page.totalElements > 0;
                    if (!$scope.query) {
                        $scope.handleResponse(response, contentProperty);
                    }
                });

                // load all of the teams for the client
                UsersClientService.getClientTeams().then(function (teams) {
                    $scope.allTeams = teams;
                });

                // load all of the tags for the client
                UsersClientService.getClientTagsWithGroups().then(function (tags) {
                    $scope.clientTags = tags;
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
             * @param teamTagFilter the team and or tag filter
             */
            function performSearch(q, status, sort, recalculateStatusFilterAndTotal, teamTagFilter) {
                if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
                    $scope.loading = true;
                    $scope.serializeToQueryString(q, 'u', status, sort);

                    UsersClientService.list($scope.client,
                        $scope.query, sort, status, teamTagFilter).then(
                        function success(response) {
                            if (!response) {
                                // leave the existing sort, since one didn't come back
                                $scope.sortProperty = sort;
                            }

                            // common paginated response handling
                            $scope.handleResponse(response, contentProperty);

                            // update team and tag filters with response
                            $scope.teamTagFilter = UsersClientService.updateTeamTagFilterFromResponse(teamTagFilter, response);

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
