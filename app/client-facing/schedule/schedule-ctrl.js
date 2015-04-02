'use strict';

angular.module('emmiManager')
    .controller('ScheduleController', ['$scope', '$controller', 'team',
        function ($scope, $controller, team) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);

        }
    ])
;
