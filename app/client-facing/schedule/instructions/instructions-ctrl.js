(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * This is the controller responsible for rendering the patient instructions for a
     * scheduled program
     */
        .controller('ScheduleProgramInstructionsViewController',
        ['$scope', '$controller', '$location', '$sce', 'scheduledPrograms',
            function ($scope, $controller, $location, $sce, scheduledPrograms) {

                $controller('CommonPagination', {$scope: $scope});
                $controller('CommonSort', {$scope: $scope});

                $scope.handleResponse(scheduledPrograms, 'scheduledPrograms');
                $scope.patient = $scope.scheduledPrograms[0].entity.patient;
                $scope.team = $scope.scheduledPrograms[0].entity.team;
                $scope.encounter = $scope.scheduledPrograms[0].entity.encounter;

                // Pass URL paramters to the view for URL creation.
                $scope.params = $location.search();


                /**
                 * Fill iframe with English instruction
                 */
                $scope.printInEnglish = function () {
                    $scope.whenSaving = true;
                    var current = $location.url();
                    var link = $location.path('/teams/' + $scope.team.id + '/encounter/' +$scope.encounter.id+ '/instructions/en/print').absUrl();
                    $scope.printingMaterial = $sce.trustAsResourceUrl(link);
                    // set link back to where we are now so current window doesn't change
                    $location.path(current);
                };

                /**
                 * Fill iframe with Spanish instruction
                 */
                $scope.printInSpanish = function () {
                    $scope.whenSaving = true;
                    var current = $location.url();
                    var link = $location.path('/teams/' + $scope.team.id + '/encounter/' +$scope.encounter.id+ '/instructions/es/print').absUrl();
                    $scope.printingMaterial = $sce.trustAsResourceUrl(link);
                    // set link back to where we are now so current window doesn't change
                    $location.path(current);
                };

                /**
                 * event:printed is expected when print dialog in iframe is closed through either cancel or print
                 *
                 */
                $scope.$on('event:printed', function () {
                    // delete printingMaterial
                    delete $scope.printingMaterial;
                    $scope.whenSaving = false;
                    $scope.$apply();
                });
            }
        ])

        .filter('localDate', ['moment', function (moment) {
            return function (value, format) {
                if (typeof value === 'undefined' || value === null) {
                    return '';
                } else {
                    // move to end of day
                    value += 'T24:00:00.000Z';
                }
                if (format === 'undefined' || format === null){
                    format = 'MM/DD/YYYY';
                }
                var date = moment.utc(value).local();
                if (!date.isValid()) {
                    return value;
                }
                return date.format(format);
            };
        }])

    ;


})(window.angular);
