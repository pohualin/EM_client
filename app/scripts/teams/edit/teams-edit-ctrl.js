'use strict';

angular.module('emmiManager')

    .controller('TeamEditController', function ($scope, teamClientResource, EditTeam, ViewTeam, $controller) {

        $controller('TeamErrorController', {$scope: $scope});

        if (teamClientResource && teamClientResource.teamResource) {
            $scope.teamClientResource = teamClientResource;
            $scope.team = teamClientResource.teamResource.entity;
            ViewTeam.setTeam(teamClientResource.teamResource);
            $scope.teamResource = teamClientResource.teamResource;
            $scope.team.currentlyActive = teamClientResource.teamResource.entity.active;
            $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});
        }

        $scope.url = teamClientResource.clientResource.link.findByNormalizedName;

        $scope.cancel = function () {
            $scope.editMode = false;
            $scope.formSubmitted = false;
            $scope.team = $scope.teamToEdit;
            $scope.teamResource.entity = $scope.teamToEdit;
            $scope.teamClientResource.teamResource.entity = $scope.teamToEdit;
            delete $scope.teamToEdit;
        };

        $scope.edit = function () {
            $scope.editMode = true;
            $scope.teamToEdit = angular.copy($scope.team);
            $scope.teamToEdit.origSalesForceAccount = $scope.teamToEdit.salesForceAccount.accountNumber;
            focus('teamName');
        };

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.team.salesForceAccount) {
                EditTeam.save(teamClientResource.teamResource).then(function (team) {
                    angular.extend($scope.team, team.data.entity);
                    angular.extend($scope.teamResource, team.data);
                    $scope.teamClientResource.teamResource = $scope.teamResource;
                    $scope.editMode = false;
                });
            } else {
                $scope.showError();
            }
        };

    })
;
