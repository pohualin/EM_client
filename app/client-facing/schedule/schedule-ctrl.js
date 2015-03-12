'use strict';

angular.module('emmiManager')
    .controller('ScheduleController', ['$scope', 'team',
        function ($scope, team) {
            $scope.team = team;
            $scope.page.setTitle('Schedule Emmi Program - ' + team.entity.name);

        }
    ])
;
