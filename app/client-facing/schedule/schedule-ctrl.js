'use strict';

angular.module('emmiManager')
    .controller('ScheduleController', ['$scope', '$controller', 'team', 'client', '$rootScope',
        function ($scope, $controller, team, client, $rootScope) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);
            $scope.client = client;

            $scope.savePatientAndProgram = function () {
                $rootScope.$broadcast('event:update-patient-and-programs');
            };
        }
    ])
;
