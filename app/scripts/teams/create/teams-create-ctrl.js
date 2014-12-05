'use strict';

angular.module('emmiManager')
/**
 * Create a Single Team
 */
    .controller('ClientTeamCreateCtrl', function ($scope, $http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $controller, clientResource, Client) {

        $controller('TeamErrorController', {$scope: $scope});

        $scope.teamToSave = CreateTeam.newTeam().entity;

        $scope.teamClientResource = {
            teamResource: {
                entity: {}
            },
            clientResource: clientResource
        };

        $controller('SalesForceCtrl', {$scope: $scope, team: $scope.teamToSave});

        $scope.teamToSave.client = clientResource.entity;
        $scope.url = clientResource.link.findByNormalizedName;
        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.teamToSave.salesForceAccount) {
                CreateTeam.insertTeams(clientResource, $scope.teamToSave).then(function (team) {
                    ViewTeam.viewTeam(team.data.entity);
                });
            } else {
                $scope.showError();
            }
        };

        $scope.cancel = function () {
            Client.viewClient($scope.teamToSave.client);
        };

    })
;
