(function (angular) {
    'use strict';

    angular.module('emmiManager')

    /**
     * This is the controller responsible for rendering the English version printing materials
     * 
     */
        .controller('PrintEnglishInstructionsController',
        ['$scope', '$controller', '$window', '$timeout', 'scheduledPrograms',
            function ($scope, $controller, $window, $timeout, scheduledPrograms) {
            
                $controller('CommonPagination', {$scope: $scope});
                $controller('CommonSort', {$scope: $scope});
                
                $scope.handleResponse(scheduledPrograms, 'scheduledPrograms');
                $scope.patient = $scope.scheduledPrograms[0].entity.patient;
                $scope.team = $scope.scheduledPrograms[0].entity.team;
                $scope.encounter = $scope.scheduledPrograms[0].entity.encounter;

                // Create an array of provider names.
                $scope.providers = [];
                angular.forEach($scope.scheduledPrograms, function (scheduledProgram) {
                    $scope.providers.push(scheduledProgram.entity.provider.fullName);
                });

                // Filter out redundant providers.
                $scope.providers = $scope.providers.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

                // Limit the number of programs unless the number of programs is one more than the limit.
                $scope.limit = 5;
                if ($scope.scheduledPrograms.length === $scope.limit + 1) {
                    $scope.limit++;
                }

                $scope.year = new Date().getFullYear();
                                
                // We need this to get parent scope because we're in an iframe
                var parentScope = $window.parent.angular.element($window.frameElement).scope();
                
                // timeout wait until everything is loaded
                // call $window.print() to bring up the print dialog
                $timeout(function () {
                    $window.print();
                    parentScope.$emit('event:printed');
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
