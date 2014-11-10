'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamClientResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});
        $scope.teamClientResource = teamClientResource;
        if (teamClientResource && teamClientResource.teamResource) {
            $scope.team = teamClientResource.teamResource.entity;
            $scope.teamResource = teamClientResource.teamResource;
            $scope.team.currentlyActive = teamClientResource.teamResource.entity.active;
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

        $scope.cancel = function () {
            ViewTeam.viewTeam($scope.team);
        };

    })
;