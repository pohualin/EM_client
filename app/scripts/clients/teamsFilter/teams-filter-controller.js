'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter) {
        $scope.clientId = Client.getClient().entity.id;
        TeamsFilter.getClientTeams().then(function (teamsForClient) {
            $scope.clientTeams = teamsForClient;
        });
    });
