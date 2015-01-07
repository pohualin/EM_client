'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterController', function ($scope, Client, TeamsFilter, $controller, $q) {
        $controller('TeamsFilterCommon', {
            $scope: $scope
        });

        $scope.selectedGroup = '';
        $scope.filterTags = [];
        $scope.clientId = Client.getClient().entity.id;
        $scope.defaultTeams = [];
        $scope.defaultTeamTags = [];
        $scope.showInactiveTeams = false;
        $scope.inactiveTeams = null;
        $scope.showUntaggedTeams = false;

        $q.all([
            TeamsFilter.getTeamTags($scope.filterTags).then(function (teamTags) {
                //save all the team tags on the client
                $scope.teamTags = teamTags;
                $scope.defaultTeamTags = teamTags;
            }),

            TeamsFilter.getClientGroups().then(function (groups) {
                    //all groups on client
                    $scope.clientGroups = groups;
                    $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
                }
            ),
            TeamsFilter.getClientTeams().then(function (teams) {
                //save all the teams on a client
                $scope.defaultTeams = teams;
                $scope.clientTeams = teams;
            })
        ]).then(function () {
            $q.all([
                //check if there are inactive teams on the client
                TeamsFilter.getInactiveTeamsForClient().then(function (inactiveTeams) {
                    if (inactiveTeams.length > 0) {
                        $scope.inactiveTeams = inactiveTeams;
                    }
                    //get the url parameters
                    $scope.getUrl();
                }),
                TeamsFilter.getTeamsWithNoTeamTags().then(function (teams) {
                        if (teams.length > 0) {
                            $scope.teamsWithNoTeamTags = teams;
                            angular.forEach(teams, function (team) {
                                $scope.defaultTeams[team.name] = team;
                            });
                            $scope.defaultTeams.sort(function (a, b) {
                                return a.name.localeCompare(b.name);
                            });
                            $scope.clientTeams = angular.copy($scope.defaultTeams);

                        }
                    }
                )
            ]);
        });

        $scope.showClientTeams = function () {
            $scope.useGroupDisplay = false;
            if ($scope.showInactiveTeams) {
                //show all teams including inactive teams
                $scope.clientTeams = angular.copy($scope.defaultTeams);
                angular.forEach($scope.inactiveTeams, function (inactiveTeams) {
                    $scope.clientTeams.push(inactiveTeams);
                });
                $scope.clientTeams.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
            } else {
                ///show all active teams on the client
                $scope.clientTeams = angular.copy($scope.defaultTeams);
                $scope.teamTags = angular.copy($scope.defaultTeamTags);
            }
        };
        $scope.showClientTeams();

        $scope.getTeamTagsForGroup = function () {
            //set the selected group on the URL parameter
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
                //a group is selected
                $scope.useGroupDisplay = true;
                TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                    if ($scope.showInactiveTeams) {
                        //show active and inactive teams in group
                        $scope.listOfTeamsByTag = TeamsFilter.getActiveAndInactiveTeamsForTags($scope.teamTags, tags).then(function (listOfTeamsByTag) {
                            $scope.listOfTeamsByTag = listOfTeamsByTag;
                            $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup($scope.teamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                        });
                    } else {
                        //show active teams in group
                        $scope.listOfTeamsByTag = TeamsFilter.getTeamsForTags($scope.teamTags, tags).then(function (listOfTeamsByTag) {
                            $scope.listOfTeamsByTag = listOfTeamsByTag;
                            $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup($scope.teamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                        });
                    }
                });
            }
        };

        $scope.showFilteredTeams = function () {
            //set the selected tags to filter by in the url params
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
                        //if object is empty
                        if (Object.keys(teams).length === 0) {
                            $scope.clientTeams = null;
                        }
                    });
                    if ($scope.showInactiveTeams) {
                        //show active and inactive teams in filtered tags
                        TeamsFilter.getInactiveTeamsFromTeamTags($scope.teamTags, $scope.clientTeams).then(function (teams) {
                            //append inactive teams to clientTeams
                            angular.forEach(teams, function (team) {
                                $scope.clientTeams[team.name] = team;
                            });
                        });
                    }
                });
            }
        };

        $scope.showFilteredAndGroupedTeams = function () {
            //a group and tags have been selected
            $scope.useGroupDisplay = true;
            TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                TeamsFilter.getFilteredTeamTags($scope.filterTags).then(function (filteredTeamTags) {
                    if ($scope.showInactiveTeams) {
                        //show active and inactive teams in group and filtered tag
                        $scope.listOfTeamsByTag = TeamsFilter.getActiveAndInactiveTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                            $scope.listOfTeamsByTag = listOfTeamsByTag;
                            $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup(filteredTeamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                        });
                    } else {
                        //show active teams in group and filtered tag
                        TeamsFilter.getTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                            $scope.listOfTeamsByTag = listOfTeamsByTag;
                            $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup(filteredTeamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                        });
                    }
                });
            });
        };

        $scope.toggleInactiveTeams = function () {
            if ($scope.showInactiveTeams) {
                // show inactive teams
                $scope.showInactiveTeams = false;
                $scope.setInactiveTeamsURL();

                if ($scope.useGroupDisplay) {
                    if ($scope.filterTags.length > 0) {
                        //group and filter tags selected
                        TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                            TeamsFilter.getFilteredTeamTags($scope.filterTags).then(function (filteredTeamTags) {
                                TeamsFilter.getTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                                    $scope.listOfTeamsByTag = listOfTeamsByTag;
                                    $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup(filteredTeamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                                });
                            });
                        });
                    } else {
                        //only a group has been selected
                        TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                            TeamsFilter.getTeamsForTags($scope.teamTags, tags).then(function (listOfTeamsByTag) {
                                $scope.listOfTeamsByTag = listOfTeamsByTag;
                                $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup($scope.teamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                            });
                        });
                    }

                } else {
                    //no group selected
                    if ($scope.filterTags.length === 0) {
                        //no tag to filter by selected
                        $scope.showClientTeams();
                        return;
                    }
                    TeamsFilter.getTeamTags($scope.filterTags).then(function (teamTags) {
                        TeamsFilter.getTeamsFromTeamTags(teamTags).then(function (teams) {
                            $scope.clientTeams = teams;
                            //check if object is empty
                            if (Object.keys(teams).length === 0) {
                                $scope.clientTeams = null;
                            }
                        });
                    });
                }

            } else {
                //only show active teams
                $scope.showInactiveTeams = true;
                $scope.setInactiveTeamsURL();
                if ($scope.useGroupDisplay) {
                    //group has been selected
                    if ($scope.filterTags.length > 0) {
                        //group and filter tags selected
                        TeamsFilter.getTagsForFilteredTagsAndGroup($scope.filterTags, $scope.selectedGroup.entity.tag).then(function (tags) {
                            TeamsFilter.getFilteredTeamTags($scope.filterTags).then(function (filteredTeamTags) {
                                TeamsFilter.getActiveAndInactiveTeamsForTags(filteredTeamTags, tags).then(function (listOfTeamsByTag) {
                                    $scope.listOfTeamsByTag = listOfTeamsByTag;
                                    $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup(filteredTeamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                                });
                            });
                        });
                    } else {
                        //only group selected
                        TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tags) {
                            $scope.listOfTeamsByTag = TeamsFilter.getActiveAndInactiveTeamsForTags($scope.teamTags, tags).then(function (listOfTeamsByTag) {
                                $scope.listOfTeamsByTag = listOfTeamsByTag;
                                $scope.teamsNotInGroup = TeamsFilter.getTeamsNotInGroup($scope.teamTags, listOfTeamsByTag, $scope.showInactiveTeams);
                            });
                        });
                    }
                } else {
                    //group not selected
                    if ($scope.filterTags.length === 0) {
                        //no tag to filter by selected
                        $scope.showClientTeams();
                        return;
                    }
                    TeamsFilter.getInactiveTeamsFromTeamTags($scope.teamTags, $scope.clientTeams).then(function (teams) {
                        //append inactive teams to clientTeams
                        angular.forEach(teams, function (team) {
                            $scope.clientTeams[team.name] = team;
                        });
                    });
                }
            }
        };

        $scope.toggleUntaggedTeams = function () {
            if (!$scope.showUntaggedTeams) {
                $scope.showUntaggedTeams = true;
                $scope.useGroupDisplay = false;
                $scope.showInactiveTeams = false;
                $scope.clientTeams = $scope.teamsWithNoTeamTags;
                $scope.filterTags = [];
                $scope.selectedGroup = '';
                $scope.setGroupUrl();
                $scope.setTagsUrl();
                $scope.setInactiveTeamsURL();
                $scope.setUntaggedTeamsURL();

            } else {
                $scope.showUntaggedTeams = false;
                $scope.clientTeams = $scope.defaultTeams;
                $scope.setUntaggedTeamsURL();

            }
        };
    }
)
;
