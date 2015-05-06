'use strict';

angular.module('emmiManager')

    .service('TeamsFilter', function ($http, $q, UriTemplate, TeamTag, Tag, Client, CommonService) {
        return {
            /**
             * get groups for clients to fill the group by dropdown
             * and the tags to fill the  filter by box
             */
            getClientGroups: function () {
                //get all of the groups for a client
                var groups = [];

                return $http.get(UriTemplate.create(Client.getClient().link.groups).stringify({
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
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
                        });
                    }
                    return groups;
                });
            },

            /**
             * get the tags for all the groups on a client
             * @param groups
             * @returns {Array} of client tags
             */
            getClientTagsInGroups: function (groups) {
                //get tags for all groups on client
                var clientTagsInGroups = [{
                    text: 'Untagged Teams Only',
                    id: -1,
                    untaggedOnly: true
                }];
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
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    size: 1,
                    status: 'ALL'
                })).then(function load(response) {
                    return response.data;
                });
            },

            /**
             * check if there is at least one inactive team for a client
             * @returns page
             */
            doInactiveTeamsExistForClient: function () {
                //check if there is at least one inactive team on this client
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    status: 'INACTIVE_ONLY',
                    size: 1
                })).then(function load(response) {
                    return response.data;
                });
            },

            /**
             * check if there is at least one untagged team for a client
             * @returns page
             */
            doUntaggedTeamsExist: function () {
                //check if there is at least one team with out a tag on this client
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    size: 1,
                    status: 'ALL',
                    teamTagsType: 'UNTAGGED_ONLY'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    return page;
                });
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
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
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
                            return $http.get(page.link['page-next']).then(function (response) {
                                return load(response);
                            });
                        }
                        deferred.resolve(teamTags);
                    });
                return deferred.promise;
            },

            /**
             * get the teams from the teamtags
             * @param teamTags to parse
             * @returns {*} teams object
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
                    return a.id.localeCompare(b.id);
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
                        listOfTeamsByTag.tag = tag;
                        listOfTeamsByTag.tag.teams = teams;
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
             * This function is pretty specific, it filters the
             * allTeams param with the second list parameter
             * @param allTeams  to filter
             * @param listOfTeamsByTag created by getTeamsForTags()
             * @returns {*}
             */
            stripAllTeamsOfTeamsByTag: function (allTeams, listOfTeamsByTag) {
                var deferred = $q.defer();
                // figure out which teams are left
                var teamsWhichMatchOrganizeBy = [];
                // populate
                if (listOfTeamsByTag) {
                    Object.keys(listOfTeamsByTag).map(function (key) {
                        angular.forEach(listOfTeamsByTag[key].teams, function (team) {
                            if (teamsWhichMatchOrganizeBy.indexOf(team.id) === -1) {
                                teamsWhichMatchOrganizeBy.push(team.id);
                            }
                        });
                    });
                }
                var teamsNotInGroup = [];
                angular.forEach(allTeams, function (aTeam) {
                    if (teamsWhichMatchOrganizeBy.indexOf(aTeam.id) === -1) {
                        // team is not in organize by
                        teamsNotInGroup.push(aTeam);
                    }
                });
                deferred.resolve(teamsNotInGroup);
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
                        if (filteredTag.id === groupTag.id) {
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
