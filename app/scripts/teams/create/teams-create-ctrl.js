'use strict';

angular.module('emmiManager')
/**
 * Create a Single Team
 */
    .controller('ClientTeamCreateCtrl', function ($scope, $http, $routeParams, Session, UriTemplate, CreateTeam, ViewTeam, $controller, clientResource, Client, TeamTag) {

        $controller('TeamErrorController', {$scope: $scope});

        $scope.team = {
            'name': null,
            'description': null,
            'active': true,
            'phone': null,
            'fax': null,
            'client': {
                'id': null
            },
            'normalizedTeamName': null
        };

        $scope.teamClientResource = {
            teamResource: {
                entity: {}
            },
            clientResource: clientResource
        };

        $controller('SalesForceCtrl', {$scope: $scope, team: $scope.team});

        $scope.team.client = clientResource.entity;
        $scope.url = clientResource.link.findByNormalizedName;
        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid && $scope.team.salesForceAccount) {
                CreateTeam.insertTeams($scope.team).then(function (team) {
                    var teamResource = team.data;
                    $scope.team = teamResource.entity;
                    teamResource.tags = $scope.teamClientResource.teamResource.tags;
                    if(teamResource.tags) {
                        TeamTag.save(teamResource).then(function () {
                            ViewTeam.viewTeam($scope.team);
                        });
                    }else{
                        ViewTeam.viewTeam($scope.team);
                    }
                });
            } else {
                $scope.showError();
            }
        };

        $scope.cancel = function () {
            Client.viewClient($scope.team.client);
        };

    })
;
