(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * This is the controller responsible for rendering the patient instructions for a
     * scheduled program
     */
        .controller('ScheduleProgramInstructionsViewController',
        ['$scope', '$controller', 'scheduledPrograms',
            function ($scope, $controller, scheduledPrograms) {
            
                $controller('CommonPagination', {$scope: $scope});
                $controller('CommonSort', {$scope: $scope});
                
                $scope.handleResponse(scheduledPrograms, 'scheduledPrograms');
                $scope.patient = $scope.scheduledPrograms[0].entity.patient;
                $scope.team = $scope.scheduledPrograms[0].entity.team;
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
