'use strict';

angular.module('emmiManager')
    .controller('SearchPatientController', ['$scope', '$controller', 'SearchPatientService', 'client',
        function ($scope, $controller, SearchPatientService, client) {

            $controller('CommonSearch', {$scope: $scope}); //wait a min, this i scoming in from admin.html?

            var contentProperty = 'patients';

            $scope.removeStatusFilterAndTotal = false;

            $scope.search = function () {
                $scope.performSearch(client, $scope.query, null, null, null);
            };

            // when a column header is clicked
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                $scope.performSearch(client, $scope.query, sort, $scope.currentPageSize);
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

            $scope.performSearch = function (client, query, sort, size, page) {
                SearchPatientService.search(client, query, sort, size, page).then(function (response) {
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
