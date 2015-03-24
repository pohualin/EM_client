'use strict';

angular.module('emmiManager')
    .controller('ScheduleController', ['$scope', '$controller', 'team', 'ScheduleService',
        function ($scope, $controller, team, ScheduleService) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);

            // add common pagination and sorting functions
            $controller('CommonPagination', {$scope: $scope});
            $controller('CommonSort', {$scope: $scope});

            var contentProperty = 'programs';

            /**
             * The actual 'search' function
             *
             * @param sort the sort component
             * @param size the size of the page
             */
            var performSearch = function (sort, size) {
                ScheduleService.findPrograms(team, sort, size).then(function (programPage) {
                    $scope.handleResponse(programPage, contentProperty);
                });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
            };

            /**
             * Search again sorting based upon the property
             *
             * @param property to sort on
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                performSearch(sort, $scope.currentPageSize);
            };

            /**
             * Fetches a page from a pagination link
             *
             * @param href to use for the data call
             */
            $scope.fetchPage = function (href) {
                $scope.loading = true;
                ScheduleService.fetchProgramPage(href).then(function (programPage) {
                    $scope.handleResponse(programPage, contentProperty);
                });
            };

            // load the programs
            performSearch();
        }
    ])
;
