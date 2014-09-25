'use strict';

angular.module('emmiManager')

    /**
     * View a single team
     */
    .controller('ClientTeamViewCtrl', function ($scope, teamResource, ViewTeam, $controller) {
        $controller('ViewEditCommon', {$scope: $scope});

        if (teamResource) {
            $scope.team = teamResource.entity;
            ViewTeam.setTeam(teamResource);
        }
    })
;
