'use strict';

angular.module('emmiManager')
    .controller('SearchPatientController', ['$scope', '$controller', '$location', 'SearchPatientService', 'client', 'team', 'ScheduledProgramFactory',
        function ($scope, $controller, $location, SearchPatientService, client, team, ScheduledProgramFactory) {

            $controller('ClientCommonSearch', {$scope: $scope});

            // Reset the variables from the ScheduledProgramFactory before searching for patients
            ScheduledProgramFactory.reset();

            var contentProperty = 'patients';
            $scope.team = team;
            ScheduledProgramFactory.team = team;
            $scope.removeStatusFilterAndTotal = false;

            $scope.search = function () {
                $scope.performSearch(team, $scope.query, null, null, null);
            };

            // when a column header is clicked
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                $scope.performSearch(team, $scope.query, sort, $scope.currentPageSize);
            };

            // when a pagination link is used
            $scope.fetchPage = function (href) {
                $scope.loading = true;
                SearchPatientService.fetchPage(href).then(function (response) {
                    $scope.handleResponse(response, contentProperty);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            };

            $scope.performSearch = function (team, query, sort, size, page) {

                $location.search({'q': query});

                SearchPatientService.search(team, query, sort, size, page).then(function (response) {
                    $scope.handleResponse(response, contentProperty);
                    $scope.searchPerformed = true;
                    $scope.page.setTitle('Patient Search Results');
                    if (!response) {
                        $scope.removeStatusFilterAndTotal = true;
                    }
                });
            };

            // Auto-search if query parameter is set.
            if ($location.search().q) {
                $scope.query = $location.search().q;
                $scope.search();
            }

        }
    ])
;
