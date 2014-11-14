'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamClientResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});

        if (teamClientResource && teamClientResource.teamResource) {
            $scope.teamClientResource = teamClientResource;
            $scope.teamResource = teamClientResource.teamResource;
            $scope.team = teamClientResource.teamResource.entity;
            ViewTeam.setTeam(teamClientResource.teamResource);
            $scope.team.currentlyActive = teamClientResource.teamResource.entity.active;
            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        }

        function setTitle(){
            $scope.page.setTitle('Team ' + $scope.team.id + ' - ' + $scope.team.name);
        }

        setTitle();

        $scope.url = teamClientResource.clientResource.link.findByNormalizedName;

        $scope.cancel = function () {
            $scope.hideError();
            $scope.editMode = false;
            $scope.formSubmitted = false;
            delete $scope.teamToSave;
        };

        $scope.edit = function () {
            $scope.editMode = true;
            $scope.teamToSave = angular.copy($scope.team);
            $scope.teamToSave.origSalesForceAccount = $scope.teamToSave.salesForceAccount.accountNumber;
            focus('teamName');
        };

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.teamToSave.salesForceAccount) {
                EditTeam.save($scope.teamToSave, teamClientResource.teamResource.link.self).then(function (team) {
                    angular.extend($scope.team, team.data.entity);
                    angular.extend($scope.teamResource, team.data);
                    setTitle();
                    $scope.teamClientResource.teamResource = $scope.teamResource;
                    $scope.editMode = false;
                });
            } else {
                $scope.showError();
            }
        };


    })
;
