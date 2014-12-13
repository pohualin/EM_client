'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter) {
        $scope.selectedGroup = '';
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;

        TeamsFilter.getClientTeamTags($scope.filterTags).then(function (teamtags) {
            $scope.clientTeamTags = teamtags;
            TeamsFilter.getClientTeams(teamtags).then(function (teams) {
                $scope.clientTeams = teams;
            });
        });

        TeamsFilter.getClientGroups().then(function (groups) {
            $scope.clientGroups = groups;
            $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
        });

        $scope.showClientTeams = function () {
            $scope.useClientTeamsDisplay = true;
            $scope.useGroupDisplay = false;
            $scope.useFilteredDisplay = false;
        };
        $scope.showClientTeams();

        $scope.getTeamTagsForClientAndGroup = function () {
            if (($scope.filterTags.length === 0 || $scope.filterTags===[]) && ($scope.selectedGroup === null || $scope.selectedGroup === '')) {
                $scope.showClientTeams();
                $scope.listOfTeamsByTag = [];
            } else if ($scope.filterTags.length !== 0 && ($scope.selectedGroup === null || $scope.selectedGroup === '')) {
                $scope.showFilteredTeams();
            } else if ($scope.filterTags.length > 0) {
                $scope.useGroupDisplay = true;
                $scope.useFilteredDisplay = false;
                $scope.showFilteredAndGroupedTeams();
            } else {
                $scope.useClientTeamsDisplay = false;
                $scope.useGroupDisplay = true;
                $scope.useFilteredDisplay = false;

                TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                    $scope.tagsInSelectedGroup = tags;
                    $scope.listOfTeamsByTag = TeamsFilter.getTeamsForTags($scope.clientTeamTags,tags);
                });
            }
        };

        $scope.showFilteredTeams = function () {
            if ($scope.filterTags.length === 0 && ($scope.selectedGroup === null || $scope.selectedGroup === '')) {
                $scope.showClientTeams();
                return;
            } else if ($scope.filterTags.length === 0 && ($scope.selectedGroup !== null || $scope.selectedGroup !== '')) {
                $scope.getTeamTagsForClientAndGroup();
                return;
            } else if ($scope.selectedGroup !== null && $scope.selectedGroup !== '') {
                $scope.useGroupDisplay = true;
                $scope.showFilteredAndGroupedTeams();
                return;
            } else {
                $scope.useClientTeamsDisplay = false;
                $scope.useGroupDisplay = false;
                $scope.useFilteredDisplay = true;
            }
            TeamsFilter.getFilteredTeams($scope.filterTags).then(function(filteredTeamTags){
                $scope.filteredTeamTags = filteredTeamTags;
            });
        };

        $scope.showFilteredAndGroupedTeams = function () {
            TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags,$scope.selectedGroup.entity.tag).then(function (tags) {
                $scope.tagsInSelectedGroup = tags;
                TeamsFilter.getFilteredTeamTags($scope.filterTags).then(function(filteredTeamTags){
                    $scope.listOfTeamsByTag = TeamsFilter.formatTeamTags(filteredTeamTags,tags);
                });
            });
        };
    })
;
