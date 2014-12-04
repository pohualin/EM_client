'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter) {
        $scope.selectedGroup = '';
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;
        TeamsFilter.getClientTeams().then(function (teamsForClient) {
            $scope.clientTeams = teamsForClient;
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
            if ($scope.filterTags.length === 0 && ($scope.selectedGroup === null || $scope.selectedGroup === '')) {
                $scope.showClientTeams();
                $scope.listOfTeamLists = [];
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
                    $scope.listOfTeamLists = TeamsFilter.getTeamsForTagsInGroup(tags);
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
            $scope.filteredTeams = TeamsFilter.getFilteredTeams($scope.filterTags, $scope.clientTeams);
        };

        $scope.showFilteredAndGroupedTeams = function () {
            TeamsFilter.getFilteredAndGroupedTeamsToShow($scope.selectedGroup, $scope.filterTags).then(function (tagsInSelectedGroupAndFilterTag) {
                $scope.tagsInSelectedGroup = tagsInSelectedGroupAndFilterTag;
                $scope.listOfTeamLists = TeamsFilter.getTeamsForTagsInSelectedGroupAndFilteredTag(tagsInSelectedGroupAndFilterTag);
            });
        };
    })
;
