'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter, $controller, $location, URL_PARAMETERS, $q, arrays) {
        $controller('TeamsFilterCommon', {
            $scope: $scope,
            getUrl: {},
            setUrl: {}
        });

        $scope.selectedGroup = '';
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;
        $scope.defaultTeams = [];
        $scope.defaultTeamTags = [];


        var searchObject = $location.search();

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
            })]).then(function () {


            angular.forEach($scope.clientGroups, function (clientGroup) {
                if (searchObject && clientGroup.entity.id === parseInt(searchObject.g)) {
                    $scope.selectedGroup = clientGroup;
                    $scope.getTeamTagsForGroup();
                }
            });
            if(searchObject.st) {
                var selectedTags = (searchObject.st).split(',');
                angular.forEach(selectedTags, function (tagToLoadFromURLid) {
                    var keepGoing = true;
                    angular.forEach($scope.defaultTeamTags, function (teamTag) {
                        if (keepGoing && searchObject && teamTag.tag.id === parseInt(tagToLoadFromURLid)) {
                            $scope.filterTags.push(teamTag.tag);
                            keepGoing = false;
                        }
                    });
                });
                $scope.showFilteredTeams();
                $scope.urlParameters = arrays.toQueryString($location.search());
            }



        });

        $scope.showClientTeams = function () {
            //all teams on client
            $scope.useGroupDisplay = false;
            $scope.clientTeams = $scope.defaultTeams;
            $scope.teamTags = $scope.defaultTeamTags;
        };
        $scope.showClientTeams();

        $scope.getTeamTagsForGroup = function () {



            var groupIdForURL = '0';
            if ($scope.selectedGroup && $scope.selectedGroup.entity && $scope.selectedGroup.entity.id) {
                groupIdForURL = $scope.selectedGroup.entity.id;
            }



            $location.search(URL_PARAMETERS.SELECTED_GROUP, groupIdForURL).replace();
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



            var tagIds = [];
            angular.forEach($scope.filterTags, function (filteredTag) {
                tagIds.push(filteredTag.id);
            });
            tagIds =tagIds.join(',');



            $location.search(URL_PARAMETERS.SELECTED_TAGS, tagIds).replace();
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
