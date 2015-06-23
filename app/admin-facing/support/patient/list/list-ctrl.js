(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * Search users across all clients
     */
        .controller('PatientSupportSearchController', [
            '$scope', '$controller', '$sce', 'URL_PARAMETERS', 'STATUS', 'PatientSupportSearchService', '$location', '$popover',
            function ($scope, $controller, $sce, URL_PARAMETERS, STATUS, data, $location, $popover) {

                var contentProperty = 'patients';

                /**
                 * Called when the user mouseovers an access code
                 * @param $event that has the target
                 * @param patientResource being moused over
                 */
                $scope.showScheduledPrograms = function ($event, patientResource) {
                    var scheduledProgram = patientResource.entity.scheduledProgram[0],
                        popover = $popover(angular.element($event.target), {
                            placement: 'top',
                            content: scheduledProgram,
                            trigger: 'manual',
                            template: 'admin-facing/support/patient/list/scheduled_program_popover.tpl.html'
                        });
                    popover.$promise.then(function ready() {
                        data.loadAllScheduledPrograms(patientResource, scheduledProgram, popover);
                        $scope.popovers[patientResource.entity.id] = popover;
                        popover.show();
                    });
                };

                /**
                 * Called when the user mouseout's an access code
                 * @param patientResource leaving mouseover
                 */
                $scope.hideScheduledPrograms = function (patientResource) {
                    $scope.popovers[patientResource.entity.id].destroy();
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
                    performSearch($scope.query, sort);
                };

                /**
                 * Called when fetching different pages
                 */
                $scope.fetchPage = function (href) {
                    $scope.loading = true;
                    data.fetchPage(href).then(function (patients) {
                        $scope.handleResponse(patients, contentProperty);
                    }, function () {
                        $scope.loading = false;
                    });
                };

                /**
                 * Performs a search via the service layer and handles persistence to
                 * the query string
                 *
                 * @param q the query
                 * @param sort to sort by
                 */
                function performSearch(q, sort) {
                    if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
                        $scope.loading = true;
                        data.list(
                            $scope.query, sort).then(
                            function success(response) {
                                if (!response) {
                                    // leave the existing sort, since one didn't come back
                                    $scope.sortProperty = sort;
                                } else if (response.page && response.page.totalElements === 1) {
                                    // bounce out to the detail page
                                    $scope.serializeToQueryString(null, URL_PARAMETERS.ALL_PATIENTS);
                                    $location.path('/support/patients/' + response.content[0].entity.id);
                                    return;
                                }

                                // common paginated response handling
                                $scope.handleResponse(response, contentProperty);
                                $scope.serializeToQueryString(q, URL_PARAMETERS.ALL_PATIENTS, null, sort);

                            }, function failure() {
                                $scope.loading = false;
                            });
                        // turn off the sort after the search request has been made, the response will rebuild
                        $scope.sortProperty = null;
                        _paq.push(['trackSiteSearch', q, 'All Patients Search']);
                    }
                }

                (function init() {
                    $controller('CommonSearch', {$scope: $scope});

                    $scope.page.setTitle('Search Patients');
                    $scope.searchPerformed = false;
                    $scope.popovers = {};

                    // perform search if the query string has search arguments
                    if ($scope.query) {
                        if ($scope.pageWhereBuilt === URL_PARAMETERS.ALL_PATIENTS) {
                            performSearch($scope.query, $scope.sortProperty);
                        } else {
                            // it was built by a different page, use the query only
                            performSearch($scope.query);
                        }
                    }
                })();
            }]);
})(window.angular);
