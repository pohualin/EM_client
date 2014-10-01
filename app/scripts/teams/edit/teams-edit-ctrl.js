'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamClientResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});

        if (teamClientResource && teamClientResource.teamResource) {
            $scope.team = teamClientResource.teamResource.entity;
            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        }

        $scope.url = teamClientResource.clientResource.link.findByNormalizedName;

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.team.salesForceAccount) {
                EditTeam.save(teamClientResource.teamResource).then(function (team) {
                    $scope.team = team.data.entity;
                    ViewTeam.viewTeam($scope.team);
                });
            } else {
                $scope.showError();
            }
        };

    })
;
