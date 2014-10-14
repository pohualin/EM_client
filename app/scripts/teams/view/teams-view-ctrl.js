'use strict';

angular.module('emmiManager')

    /**
     * View a single team
     */
    .controller('ClientTeamViewCtrl', function ($scope, teamClientResource, ViewTeam, ProviderView) {

        if (teamClientResource && teamClientResource.teamResource) {
            $scope.team = teamClientResource.teamResource.entity;
            ViewTeam.setTeam(teamClientResource.teamResource);
            $scope.teamResource = teamClientResource.teamResource;
        }
    })
;
