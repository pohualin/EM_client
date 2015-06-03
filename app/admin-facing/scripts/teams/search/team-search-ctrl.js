'use strict';

angular.module('emmiManager')

    .controller('TeamSearchController',function ($scope, URL_PARAMETERS, STATUS, Client, TeamSearch, $controller){

        $controller('CommonSearch', {$scope: $scope});

        var contentProperty = 'teams';

        Client.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
        });

        var performSearch = function(q, status, sort, size, recalculateStatusFilterAndTotal){
            if (!$scope.searchForm || !$scope.searchForm.query.$invalid ) {
                $scope.loading = true;
                $scope.serializeToQueryString(q, URL_PARAMETERS.TEAM, status, sort, size);
                TeamSearch.search(q, status, sort, size).then(function (teamPage) {
                    $scope.handleResponse(teamPage, contentProperty);
                    if (recalculateStatusFilterAndTotal) {
                        $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                    }
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
                _paq.push(['trackSiteSearch', q, 'Team Search']);
            }
        };

        $scope.viewTeam = function (team) {
        	TeamSearch.viewTeam(team);
        };

        // when first loading the page, via SearchUriPersistence set variables
        if ($scope.query) {
            if ($scope.pageWhereBuilt === URL_PARAMETERS.TEAM) {
                performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize,
                        $scope.status !== STATUS.INACTIVE_ONLY);
            } else {
                // it was built by a different page, use the query only
                performSearch($scope.query, null, null, null, true);
            }
        }

        // when the search button is used
        $scope.searchTeams = function () {
            performSearch($scope.query, null, null, null, true);
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            var sort = $scope.createSortProperty(property);
            performSearch($scope.query, $scope.status, sort, $scope.currentPageSize);
        };

        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            performSearch($scope.query, $scope.status, $scope.sortProperty, pageSize);
        };

        // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            TeamSearch.fetchPage(href).then(function (teamPage) {
                $scope.handleResponse(teamPage, contentProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        // when the status change select changes
        $scope.statusChange = function(){
            performSearch($scope.query, $scope.status, $scope.sortProperty, $scope.currentPageSize);
        };

    });
