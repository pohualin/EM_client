'use strict';

angular.module('emmiManager')
    .controller('SearchPatientController', ['$scope', '$controller', 'SearchPatientService', 'client', 'team',
        function ($scope, $controller, SearchPatientService, client, team) {

            $controller('ClientCommonSearch', {$scope: $scope});

            var contentProperty = 'patients';
            $scope.team = team;
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
                SearchPatientService.search(team, query, sort, size, page).then(function (response) {
                    $scope.handleResponse(response, contentProperty);
                    $scope.searchPerformed = true;
                    if (!response) {
                        $scope.removeStatusFilterAndTotal = true;
                    }
                });
            };
        }
    ])
;
