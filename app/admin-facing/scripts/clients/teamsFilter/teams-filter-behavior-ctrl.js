'use strict';

angular.module('emmiManager')

/**
 * This controller is where the behaviors for the TeamsFilter are living.
 */
    .controller('TeamsFilterController', ['$scope', '$controller', 'TeamsFilter',
        function ($scope, $controller, TeamsFilter) {

            $controller('TeamsFilterInitialization', {
                $scope: $scope
            });

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

            $scope.showClientTeams = function () {
                $scope.useGroupDisplay = false;
                $scope.clientTeams = {};
                TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams).then(function (teams) {
                    //get all of the active or inactive teams including untagged teams for a client based on the showInactiveTeams variable
                    $scope.addListToClientTeams(teams);
                });
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

                    /**
                     * get teams to show in not now
                     */
                    TeamsFilter.getActiveOrAllTeamTagsForFilteredTags([], $scope.showInactiveTeams).then(function (clientTeamTags) {
                        //get all team tags for the client that are active or inactive based on $scope.showInactiveTeams
                        TeamsFilter.getTeamsForTags(clientTeamTags, tags).then(function (listOfTeamsByTag) {
                            //organize teams into an object with team name as the key and a list of tags as the values i.e. {teamName :[tag1,tag2,tag3], teamName2: [tag1]]}
                            TeamsFilter.getTeamsNotInGroup(clientTeamTags, listOfTeamsByTag).then(function (teamsNotInGroup) {
                                //teams to show in the 'not in this group' section
                                $scope.teamsNotInGroup = teamsNotInGroup;
                            });
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
                if ($scope.showUntaggedTeams) {
                    TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                        //get all of the active or inactive teams that do not have tags assigned to them
                        $scope.clientTeams = teams;
                    });
                } else {
                    $scope.updateState();
                }
            };

            /**
             * called when user checks or unchecks show untagged teams box
             */
            $scope.toggleUntaggedTeams = function () {
                if (!$scope.showUntaggedTeams) {
                    //show only teams with no tags, remove all filtered by tags and reset the organize by group
                    $scope.showUntaggedTeams = true;
                    $scope.useGroupDisplay = false;

                    console.log('disabling tags...');
                    angular.forEach($scope.clientTagGroupToDisplay, function (tag) {
                        tag.disabled = true;
                    });

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

                    console.log('enabling tags');
                    angular.forEach($scope.clientTagGroupToDisplay, function (tag) {
                        tag.disabled = false;
                    });
                    $scope.showUntaggedTeams = false;
                    $scope.setUntaggedTeamsURLParameter();
                    $scope.showClientTeams();
                    //show all the teams on the client
                }
            };
        }])
;
