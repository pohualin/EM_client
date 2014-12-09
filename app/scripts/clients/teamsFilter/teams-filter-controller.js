'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter, Tag) {
        $scope.clientId = Client.getClient().entity.id;
        TeamsFilter.getClientTeams().then(function (teamsForClient) {
            $scope.clientTeams = teamsForClient;
        });

        TeamsFilter.getClientGroups().then(function (groupsForClient) {
            $scope.clientGroups = groupsForClient;
        });

        $scope.getTeamTagsForClientAndGroup = function () {
            Tag.listTagsByGroupId($scope.selectedGroup).then(function (tags) {
                var listOfTeamLists = [];
                $scope.tagsInSelectedGroup = tags;
                angular.forEach(tags, function (tag) {
                    Tag.listTeamsForTagId(tag).then(function (teams) {
                        listOfTeamLists.push(teams);
                    });
                });
                $scope.listOfTeamLists = listOfTeamLists;
            });
        };
    })
;
