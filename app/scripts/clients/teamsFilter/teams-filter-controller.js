'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter, $controller, $q) {
        $controller('TeamsFilterCommon', {
            $scope: $scope,
            getUrl: {},
            setGroupUrl: {},
            setTagsUrl: {}
        });

        $scope.selectedGroup = '';
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;
        $scope.defaultTeams = [];
        $scope.defaultTeamTags = [];

        $q.all([
            TeamsFilter.getTeamTags($scope.filterTags).then(function (teamTags) {
                $scope.teamTags = teamTags;
                $scope.defaultTeamTags = teamTags;

                TeamsFilter.getTeamsFromTeamTags(teamTags).then(function (teams) {
                    $scope.defaultTeams = teams;
                    $scope.clientTeams = teams;
                });
            }),

            TeamsFilter.getClientGroups().then(function (groups) {
                    //all groups on client
                    $scope.clientGroups = groups;
                    $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
            }
        )]).then(function () {
            $scope.getUrl();
        });

        $scope.showClientTeams = function () {
            //all teams on client
            $scope.useGroupDisplay = false;
            $scope.clientTeams = $scope.defaultTeams;
            $scope.teamTags = $scope.defaultTeamTags;
        };
        $scope.showClientTeams();

        $scope.getTeamTagsForGroup = function () {
            $scope.setGroupUrl();

            if ($scope.filterTags.length === 0 && !$scope.selectedGroup) {
                //if no tags are selected and no group is selected
                $scope.showClientTeams();
                $scope.listOfTeamsByTag = null;
            } else if ($scope.filterTags.length !== 0 && !$scope.selectedGroup) {
                //if there are tags to filter and no group is selected
                $scope.showFilteredTeams();
            } else if ($scope.filterTags.length !== 0 && $scope.selectedGroup) {
                //if there are tags to filter and a group is selected
                $scope.showFilteredAndGroupedTeams();
            } else {
                //there are tags to filter by and a group is selected
                $scope.useGroupDisplay = true;
                TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                    $scope.listOfTeamsByTag = TeamsFilter.getTeamsForTags($scope.teamTags, tags);
                });
            }
        };

        $scope.showFilteredTeams = function () {
            $scope.setTagsUrl();

            if ($scope.filterTags.length === 0 && !$scope.selectedGroup) {
                //if no tags are selected and no group is selected
                $scope.showClientTeams();
            } else if ($scope.filterTags.length === 0 && $scope.selectedGroup) {
                //if there are no tags to filter and a group is selected
                $scope.getTeamTagsForGroup();
            } else if ($scope.filterTags.length !== 0 && $scope.selectedGroup) {
                //if there are tags to filter and a group is selected
                $scope.showFilteredAndGroupedTeams();
            } else {
                //there are only tags to filter by is selected
                $scope.useGroupDisplay = false;
                TeamsFilter.getTeamTags($scope.filterTags).then(function (teamTags) {
                    TeamsFilter.getTeamsFromTeamTags(teamTags).then(function (teams) {
                        $scope.clientTeams = teams;
                        if (Object.keys(teams).length === 0) {
                            $scope.clientTeams = null;
                        }
                    });
                });
            }
        };

        $scope.showFilteredAndGroupedTeams = function () {
            //a group and tags have been selected
            $scope.useGroupDisplay = true;
            TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                TeamsFilter.getFilteredTeamTags($scope.filterTags).then(function (filteredTeamTags) {
                    $scope.listOfTeamsByTag = TeamsFilter.getTeamsForTags(filteredTeamTags, tags);
                });
            });
        };
    }
)
;
