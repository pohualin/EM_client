'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});

        if (teamResource) {
            $scope.team = teamResource.entity;
            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        }

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.team.salesForceAccount) {
                EditTeam.save(teamResource).then(function (team) {
                    $scope.team = team.data.entity;
                    ViewTeam.viewTeam($scope.team);
                });
            } else {
                $scope.showError();
            }
        };

    })
;
