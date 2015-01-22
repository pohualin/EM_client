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

        //helper method that adds listOfElements to $scope.clientTeams
        $scope.addListToClientTeams = function (listOfElements) {
            angular.forEach(listOfElements, function (element) {
                if (!element.name) {
                    throw new Error('Elements must have name attribute!');
                }
                if (!$scope.clientTeams[element.name]) {
                    //make sure element.name is unique
                    $scope.clientTeams[element.name] = element;
                }
            });
        };

        //get variables from URL params
        $q.all([
            $scope.getGroupUrlParameter(),
            $scope.getTagsUrlParameter(),
            $scope.getInactiveAndUntaggedUrlParameters()
        ]).then(function () {
            $scope.updateState();
        });

        /**
         * get groups for clients to fill the group by dropdown
         *  and the tags to fill the  filter by box
         */
        TeamsFilter.getClientGroups().then(function (groups) {
            $scope.clientGroups = groups;
            $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
        });

        /**
         * check if there are teams on the client, if not, dont show filtered teams widget
         */
        TeamsFilter.doTeamsExistForClient().then(function (page) {
            $scope.teamsExistForClient = page;
        });

        /**
         * check if there are inactive teams on the client, if not, dont show the 'show inactive teams' link
         */
        TeamsFilter.doInactiveTeamsExistForClient().then(function (page) {
            if (!page) {
                $scope.inactiveTeams = page;
            }
        });

        /**
         * check if there are teams without tags if not dont show the untagged teams checkbox
         */
        TeamsFilter.doUntaggedTeamsExist($scope.showInactiveTeams).then(function (page) {
            if (!page) {
                $scope.teamsWithNoTeamTags = false;
            }
        });

        /**
         * initial view state, show all teams including untagged teams
         */
        $scope.showClientTeams = function () {
            $scope.useGroupDisplay = false;
            $scope.clientTeams = {};
            TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams).then(function (teams) {
                //get all of the active or inactive teams including untagged teams for a client based on the showInactiveTeams variable
                $scope.addListToClientTeams(teams);
            });
        };
        if(!$scope.showUntaggedTeams){
            //we want to show all the teams on the client when the page loads unless show untagged teams is set in the url parameter
            $scope.showClientTeams();
        }

        /**
         * determine the states of the 'group by' box and 'filter by' drop down
         */
        $scope.updateState = function () {
            //if we only want to show teams with no tags
            if(!$scope.showUntaggedTeams) {
                //set the selected tags or group to filter by in the url params
                $scope.setTagsUrlParameter();
                $scope.setGroupUrlParameter();

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
            }
        };


        /**
         * show teams that have tags in the selected group
         */
        $scope.getTeamsToShowForGroup = function () {
            //a group is selected
            $scope.useGroupDisplay = true;
            TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                //get all tags for selected groups
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags([], $scope.showInactiveTeams).then(function (clientTeamTags) {
                    //get all team tags for the client that are active or inactive based on $scope.showInactiveTeams
                    TeamsFilter.getTeamsForTags(clientTeamTags, tags).then(function (listOfTeamsByTag) {
                        //organize teams into an object with team name as the key and a list of tags as the values i.e. {teamName :[tag1,tag2,tag3], teamName2: [tag1]]}
                        $scope.listOfTeamsByTag = listOfTeamsByTag;
                        //above is the teams that will be shown under the bolded tag headers
                        TeamsFilter.getTeamsNotInGroup(clientTeamTags, listOfTeamsByTag).then(function (teamsNotInGroup) {
                            //teams to show in the 'not in this group' section
                            $scope.teamsNotInGroup = teamsNotInGroup;
                        });
                    });
                });
            });
        };

        /**
         * show the teams that have the tags selected in the filter by widget and follow these rules
         * 2 Tags selected within the same group will produce teams that have EITHER tag 1 or tag 2
         * 2 tags selected from within different groups will produce teams that have BOTH tag 1 and tag 2
         */
        $scope.showFilteredTeams = function () {
            $scope.useGroupDisplay = false;
            TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (teamTags) {
                //get the teamtags on the client that match the filter by tags the user picked
                $scope.clientTeams = TeamsFilter.getTeamsFromTeamTags(teamTags);
            });
        };

        /*
        * show teams that are in the selected group and have the selected tags chosen in 'the filter by' box
        */
        $scope.showFilteredAndGroupedTeams = function () {
            //a group and tags have been selected
            $scope.useGroupDisplay = true;
            $scope.teamsNotInGroup = [];
            TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                //get the *tags* that are in the group by group and in the filtered tags the user selected
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (filteredTeamTags) {
                    //get the *teamtags* that are returned from the filter by tags
                    TeamsFilter.getTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                        //show the teams that match the filtered teamtags from filter by and the tags that were selected and in the organize by group
                        $scope.listOfTeamsByTag = listOfTeamsByTag;
                    });
                });
            });
        };

        /**
         * called when user click the show/hide inactive teams link
         */
        $scope.toggleInactiveTeams = function () {
            //toggle showing inactive teams, and update the url parameter
            $scope.showInactiveTeams = !$scope.showInactiveTeams;
            $scope.setInactiveTeamsURLParameter();
            $scope.updateState();
        };

        /**
         * called when user checks or unchecks show untagged teams box
         */
        $scope.toggleUntaggedTeams = function () {
            if (!$scope.showUntaggedTeams) {
                //show only teams with no tags, remove all filtered by tags and reset the organize by group
                $scope.showUntaggedTeams = true;
                $scope.useGroupDisplay = false;
                $scope.filterTags = [];
                $scope.selectedGroup = '';
                //set the url parameters to have no group or tags selected
                $scope.setGroupUrlParameter();
                $scope.setTagsUrlParameter();
                // set the url parameter to show untagged teams only
                $scope.setUntaggedTeamsURLParameter();
                TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                    //get all of the active or inactive teams that do not have tags assigned to them
                    $scope.clientTeams = teams;
                });
            } else {
                $scope.showUntaggedTeams = false;
                $scope.setUntaggedTeamsURLParameter();
                $scope.showClientTeams();
                //show all the teams on the client
            }
        };
    }
)
;
