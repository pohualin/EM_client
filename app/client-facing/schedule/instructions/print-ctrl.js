(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * This is the controller responsible for rendering the patient instructions for a
     * scheduled program
     */
        .controller('PrintInstructionsController',
        ['$scope', '$controller', '$window', '$timeout', '$location', 'scheduledPrograms',
            function ($scope, $controller, $window, $timeout, $location, scheduledPrograms) {
            
                $controller('CommonPagination', {$scope: $scope});
                $controller('CommonSort', {$scope: $scope});
                
                $scope.handleResponse(scheduledPrograms, 'scheduledPrograms');
                $scope.patient = $scope.scheduledPrograms[0].entity.patient;
                $scope.team = $scope.scheduledPrograms[0].entity.team;
                
                $timeout(function () {
                    $window.print();
                    $location.path('/teams/' + $scope.team.id + '/encounter/117/instructions');
                }, 1000);
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
