'use strict';
angular.module('emmiManager')

    .service('TeamsFilter', function ($http, $q, UriTemplate, TeamTag, Tag, Client, CommonService) {
        return{
            /**
             * get groups for clients to fill the group by dropdown
             * and the tags to fill the  filter by box
             */
            getClientGroups: function () {
                //get all of the groups for a client
                var deferred = $q.defer();
                var groups = [];

                $http.get(UriTemplate.create(Client.getClient().link.groups).stringify({
                    sort: 'name,asc'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    angular.forEach(page.content, function (group) {
                        group.entity.tag.sort(function (a, b) {
                            a.name.localeCompare(b.name);
                        });
                        groups.push(group);
                    });

                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    deferred.resolve(groups);
                });

                return deferred.promise;
            },

            /**
             * get the tags for all the groups on a client
             * @param groups
             * @returns {Array} of client tags
             */
            getClientTagsInGroups: function (groups) {
                //get tags for all groups on client
                var clientTagsInGroups = [];
                angular.forEach(groups, function (group) {
                    var localGroup = angular.copy(group.entity);
                    localGroup.title = group.name;

                    //rebuild groups on each tag
                    localGroup.tag = null;
                    angular.forEach(group.entity.tag, function (tag) {
                        tag.group = localGroup;
                        tag.text = tag.name;
                        clientTagsInGroups.push(tag);
                    });
                });
                return clientTagsInGroups;
            },

            /**
             * checks if there exists at least one team on the client
             * @returns the page or nothing
             */
            doTeamsExistForClient: function () {
                //check if there is at least one team on this client
                var deferred = $q.defer();
                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    size: 1,
                    status: 'ALL'
                })).then(function load(response) {
                    var page = response.data;
                    deferred.resolve(page);
                });

                return deferred.promise;
            },

            /**
             * check if there is at least one inactive team for a client
             * @returns page
             */
            doInactiveTeamsExistForClient: function () {
                //check if there is at least one inactive team on this client
                var deferred = $q.defer();
                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    status: 'INACTIVE_ONLY',
                    size: 1
                })).then(function load(response) {
                    var page = response.data;
                    deferred.resolve(page);
                });

                return deferred.promise;
            },

            /**
             * check if there is at least one untagged team for a client
             * @returns page
             */
            doUntaggedTeamsExist: function () {
                //check if there is at least one team with out a tag on this client
                var deferred = $q.defer();
                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    size: 1,
                    status: 'ALL',
                    teamTagsType: 'UNTAGGED_ONLY'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    deferred.resolve(page);
                });
                return deferred.promise;
            },

            /**
             * //get all of the teams including teams with no tags
             * @param getInactive if true return inactive and active teams
             * @returns teams that match
             */
            getActiveOrAllTeamsForClient: function (getInactive) {
                var deferred = $q.defer();
                var teams = [];
                var status;

                if (getInactive) {
                    status = 'ALL';
                } else {
                    status = 'ACTIVE_ONLY';
                }

                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    status: status,
                    teamTagsType: 'ALL'
                })).then(function load(response) {
                    var page = response.data;
                    angular.forEach(page.content, function (team) {
                        teams.push(team.entity);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    deferred.resolve(teams);
                });

                return deferred.promise;
            },

            /**
             *  get all the teamtags that match the filterTags, if no filterTags are passed return all teamtags for client
             * rules
             *  2 Tags selected within the same group will produce teams that have EITHER tag 1 or tag 2
             * 2 tags selected from within different groups will produce teams that have BOTH tag 1 and tag 2
             * @param filterTags selected to filter by
             * @param getInactive return active and inactive if true
             * @returns {*}
             */
            getActiveOrAllTeamTagsForFilteredTags: function (filterTags, getInactive) {
                var deferred = $q.defer();
                var teamTags = [];
                var tagIds = [];
                var status;

                if (getInactive) {
                    status = 'ALL';
                } else {
                    status = 'ACTIVE_ONLY';
                }

                angular.forEach(filterTags, function (filterTag) {
                    tagIds.push(filterTag.id);
                });

                //get teams tags with the tagIds from the filter by tags
                $http.get(UriTemplate.create(Client.getClient().link.teamTagsWithTags).stringify({
                        tagIds: tagIds,
                        status: status
                    })
                ).then(function load(response) {
                        var page = response.data;
                        CommonService.convertPageContentLinks(page);
                        angular.forEach(page.content, function (teamTag) {
                            teamTags.push(teamTag.entity);
                        });
                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        deferred.resolve(teamTags);
                    });
                return deferred.promise;
            },

            /**
             * get the teams from the teamtags
             * @param teamTags to parse
             * @returns {} teams object
             */
            getTeamsFromTeamTags: function (teamTags) {
                var teams = {};
                angular.forEach(teamTags, function (teamTag) {
                    //teams to show as results, using the object notation (i.e clientTeams[teamName]) to remove duplicates
                    teams[teamTag.team.name] = teamTag.team;
                });
                return teams;
            },

            /**
             * get all of the teams that do not have tags associated with them
             * @param getInactive get active and inactive if getInactive is true
             * @returns teams
             */
            getActiveOrAllTeamsWithNoTeamTags: function (getInactive) {
                var deferred = $q.defer();
                var teams = {};
                var status;

                if (getInactive) {
                    status = 'ALL';
                } else {
                    status = 'ACTIVE_ONLY';
                }

                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    status: status,
                    teamTagsType: 'UNTAGGED_ONLY'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    angular.forEach(page.content, function (team) {
                        teams[team.entity.name] = team.entity;
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }

                    deferred.resolve(teams);
                });
                return deferred.promise;
            },

            /**
             * get all tags for selected group
             * @param selectedGroup
             * @returns {*}
             */
            getTagsForGroup: function (selectedGroup) {
                var deferred = $q.defer();
                var tagList = [];

                if (selectedGroup === null) {
                    deferred.resolve(tagList);
                    return deferred.promise;
                }

                //for all tags in the selected group
                angular.forEach(selectedGroup.entity.tag, function (tag) {
                    tagList.push(tag);
                });
                tagList.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                deferred.resolve(tagList);
                return deferred.promise;
            },

            /**
             * organize tags by which team have them
             * @param teamTags as candidates
             * @param tags to match
             * @returns a list of tags where each tag has a list of teams
             */
            getTeamsForTags: function (teamTags, tags) {
                var deferred = $q.defer();
                var listOfTeamsByTag = {};
                var teams = [];

                //get all the teams that have a tag in tags
                angular.forEach(tags, function (tag) {
                    angular.forEach(teamTags, function (teamTag) {
                        if (teamTag.tag.id === tag.id) {
                            teams.push(teamTag.team);
                        }
                    });
                    teams.sort(function (a, b) {
                        if (a.name > b.name) {
                            return 1;
                        } else if (a.name < b.name) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    if (teams.length > 0) {
                        listOfTeamsByTag[tag.name] = teams;
                    }
                    teams = [];
                });

                //check if object is empty
                if (Object.keys(listOfTeamsByTag).length === 0) {
                    listOfTeamsByTag = null;
                }
                deferred.resolve(listOfTeamsByTag);
                return deferred.promise;
            },

            /**
             * make a list of teams and which tags they have
             * need to do it this way because we have to check all the team tags
             * @param teamTags as candidate
             * @param listOfTeamsByTagFromSelectedGroup a list of tags where each tag has a list of teams (see method above)
             * @returns a list of teams that don't have a tag in the selected group
             */
            getTeamsNotInGroup: function (teamTags, listOfTeamsByTagFromSelectedGroup) {
                var deferred = $q.defer();
                var listOfTagsByTeams = {};
                var tags = [];
                var teams = {};
                var teamsWithTagNotInGroup = [];

                if (listOfTeamsByTagFromSelectedGroup !== null && typeof listOfTeamsByTagFromSelectedGroup === 'object') {
                    angular.forEach(teamTags, function (teamTag) {
                        //build the list of tags a team has
                        if (listOfTagsByTeams[teamTag.team.name]) {
                            //if this team is already in our list get its list of tags and add the current tag to the list
                            tags = listOfTagsByTeams[teamTag.team.name];
                            tags.push(teamTag.tag);
                        } else {
                            //this team will only have the current tag in its list
                            tags.push(teamTag.tag);
                        }
                        //assign the current team its list of tags
                        listOfTagsByTeams[teamTag.team.name] = tags;
                        tags = [];
                        //keep track of the teams
                        teams[teamTag.team.name] = teamTag.team;
                    });

                    //get teams that don't have tags in selected group
                    angular.forEach(teams, function (team) {
                        //for each team on the client
                        var skip = false;
                        angular.forEach(listOfTagsByTeams[team.name], function (tag) {
                            //for each tag in this teams tag list
                            angular.forEach(Object.keys(listOfTeamsByTagFromSelectedGroup), function (groupTagName) {
                                //for each tag in the selected group

                                if (tag.name === groupTagName) {
                                    //if the team has any tag in it's 'tag list' that is also in the tags of the selected group
                                    //don't add this team to the 'list of teams not in the selected group'
                                    skip = true;
                                }
                            });
                        });
                        if (!skip) {
                            //if we've made it this far then we wre not able to find any tags in this teams tag list that
                            //were also in the tags of the selected group
                            teamsWithTagNotInGroup.push(team);
                        }
                    });

                    //check if object is empty
                    if (Object.keys(teamsWithTagNotInGroup).length === 0) {
                        teamsWithTagNotInGroup = null;
                    }
                } else {
                    var allClientTeams = {};
                    angular.forEach(teamTags, function (teamTag) {
                        allClientTeams[teamTag.team.name] = teamTag.team;
                    });
                    teamsWithTagNotInGroup = allClientTeams;
                }

                deferred.resolve(teamsWithTagNotInGroup);
                return deferred.promise;
            },

            /**
             * get all tags that are in both the selected group and in the filtered by tags
             * 2 Tags selected within the same group will produce teams that have EITHER tag 1 or tag 2
             * 2 tags selected from within different groups will produce teams that have BOTH tag 1 and tag 2
             * @param filteredTags selected
             * @param groupTags tags from selected group
             * @returns list of tags
             */
            getTagsForFilteredTagsAndGroup: function (filteredTags, groupTags) {
                var deferred = $q.defer();
                var tagsToReturn = [];

                angular.forEach(groupTags, function (groupTag) {
                    angular.forEach(filteredTags, function (filteredTag) {
                        if (filteredTag.name === groupTag.name) {
                            tagsToReturn.push(groupTag);
                        }
                    });
                });

                deferred.resolve(tagsToReturn);
                return deferred.promise;
            }
        };
    })
;
