'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter, $controller, $q) {
        $controller('TeamsFilterCommon', {
            $scope: $scope
        });

        $scope.selectedGroup = 0;
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;
        $scope.showInactiveTeams = false;
        $scope.inactiveTeams = true;
        $scope.showUntaggedTeams = false;
        $scope.clientTeams = {};
        $scope.teamsExistForClient = true;
        $scope.teamsWithNoTeamTags = true;

        $scope.addListToClientTeams = function (listOfElements) {
            angular.forEach(listOfElements, function (element) {
                if (!element.name) {
                    throw new Error('Elements must have name attribute!');
                }
                if (!$scope.clientTeams[element.name]) {
                    $scope.clientTeams[element.name] = element;
                }
            });
        };

        //TODO init function HERE
        //set variables from URL params
        $q.all([
            $scope.getGroupUrl(),
            $scope.getTagsUrl(),
            $scope.getInactiveAndUntaggedUrl()
        ]).then(function () {
            $scope.updateState();
        });

        TeamsFilter.getClientGroups().then(function (groups) {
            //all groups on client
            $scope.clientGroups = groups;
            $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
        });

        TeamsFilter.doTeamsExistForClient().then(function (page) {
            if (page === '') {
                $scope.teamsExistForClient = false;
            }
        });

        TeamsFilter.getInactiveTeamsForClient().then(function (page) {
            if (page === '') {
                $scope.inactiveTeams = false;
            }
        });

        TeamsFilter.doUntaggedTeamsExist($scope.showInactiveTeams).then(function (page) {
            if (page === '') {
                $scope.teamsWithNoTeamTags = false;
            }
        });

        $scope.showClientTeams = function () {
            $scope.useGroupDisplay = false;
            $scope.clientTeams = {};
            TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams).then(function (teams) {
                $scope.addListToClientTeams(teams);
            });
        };
        if(!$scope.showUntaggedTeams){
            $scope.showClientTeams();
        }

        $scope.updateState = function () {
            if($scope.showUntaggedTeams){
                return;
            }
            //set the selected tags or group to filter by in the url params
            $scope.setTagsUrl();
            $scope.setGroupUrl();

            if ($scope.filterTags.length === 0 && !$scope.selectedGroup) {
                //if no tags are selected and no group is selected
                $scope.showClientTeams();
                $scope.listOfTeamsByTag = null;
            } else if ($scope.filterTags.length === 0 && $scope.selectedGroup) {
                //if there are no tags to filter and a group is selected
                $scope.getTeamsToShowForGroup();
            } else if ($scope.filterTags.length !== 0 && !$scope.selectedGroup) {
                //there are only tags to filter by and no group is selected
                $scope.showFilteredTeams();
            } else {
                //if there are tags to filter and a group is selected
                $scope.showFilteredAndGroupedTeams();
            }
        };


        $scope.getTeamsToShowForGroup = function () {
            //a group is selected
            $scope.useGroupDisplay = true;
            TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                //show active teams in group
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags([], $scope.showInactiveTeams).then(function (clientTeamTags) {
                    TeamsFilter.getTeamsForTags(clientTeamTags, tags).then(function (listOfTeamsByTag) {
                        $scope.listOfTeamsByTag = listOfTeamsByTag;
                        TeamsFilter.getTeamsNotInGroup(clientTeamTags, listOfTeamsByTag).then(function (teamsNotInGroup) {
                            $scope.teamsNotInGroup = teamsNotInGroup;
                        });
                    });
                });
            });
        };

        $scope.showFilteredTeams = function () {
            //there are tags to filter by
            $scope.useGroupDisplay = false;
            TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (teamTags) {
                $scope.clientTeams = {};
                angular.forEach(teamTags, function (teamTag) {
                    $scope.clientTeams[teamTag.team.name] = teamTag.team;
                });
            });
        };


        $scope.showFilteredAndGroupedTeams = function () {
            //a group and tags have been selected
            $scope.useGroupDisplay = true;
            $scope.teamsNotInGroup = [];
            TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (filteredTeamTags) {
                    TeamsFilter.getTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                        $scope.listOfTeamsByTag = listOfTeamsByTag;
                    });
                });
            });
        };

        $scope.toggleInactiveTeams = function () {
            $scope.showInactiveTeams = !$scope.showInactiveTeams;
            $scope.setInactiveTeamsURL();
            $scope.updateState();
        };

        $scope.toggleUntaggedTeams = function () {
            if (!$scope.showUntaggedTeams) {
                $scope.showUntaggedTeams = true;
                $scope.useGroupDisplay = false;
                $scope.filterTags = [];
                $scope.selectedGroup = '';
                $scope.setGroupUrl();
                $scope.setTagsUrl();
                $scope.setUntaggedTeamsURL();
                TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                    if (teams.length > 0) {
                        $scope.teamsWithNoTeamTags = teams;
                        $scope.clientTeams = teams;
                    }
                });
            } else {
                $scope.showUntaggedTeams = false;
                $scope.setUntaggedTeamsURL();
                $scope.showClientTeams();
            }
        };
    }
)
;
