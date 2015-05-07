'use strict';

angular.module('emmiManager')

/**
 * Various functions to load data for the teams filter component.
 */
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
             * Get all of the teams including teams with no tags as well
             * as all of the tags on each team.
             *
             * @param getInactive if true return inactive and active teams
             * @param loadTags load all tags for each team or not
             * @returns * teams array with .currentTags as the list of tags
             */
            getActiveOrAllTeamsForClient: function (getInactive, loadTags) {

                var teams = [],
                    teamResources = [],
                    loadTagCallsToWaitFor = [],
                    status = getInactive ? 'ALL' : 'ACTIVE_ONLY',
                    deferred = $q.defer();

                $http.get(UriTemplate.create(Client.getClient().link.teams).stringify({
                    status: status,
                    teamTagsType: 'ALL'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    angular.forEach(page.content, function (teamResource) {
                        teamResources.push(teamResource);
                    });
                    // load next page of teams, serially
                    if (page.link && page.link['page-next']) {
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
                        });
                    }

                }).then(function () {
                    // teams all loaded, load tags for each team
                    angular.forEach(teamResources, function (teamResource) {
                        teamResource.entity.tags = {};
                        teamResource.entity.tagIds = [];
                        // add team entity to result
                        teams.push(teamResource.entity);

                        if (loadTags) {
                            var loadTagCall = $http.get(UriTemplate.create(teamResource.link.tags).stringify())
                                .then(function tagResponse(response) {
                                    var pageOfTags = response.data;
                                    CommonService.convertPageContentLinks(pageOfTags);
                                    // tags came back, push them into the teamResource
                                    angular.forEach(pageOfTags.content, function (teamTagResource) {
                                        teamResource.entity.tags[teamTagResource.entity.tag.id] = teamTagResource.entity.tag;
                                        teamResource.entity.tagIds.push(teamTagResource.entity.tag.id);
                                    });

                                    if (pageOfTags.link && pageOfTags.link['page-next']) {
                                        // load next page of team tags serially
                                        return $http.get(pageOfTags.link['page-next']).then(function (response) {
                                            return tagResponse(response);
                                        });
                                    }

                                });
                            loadTagCallsToWaitFor.push(loadTagCall);
                        }
                    });

                    $q.all(loadTagCallsToWaitFor).then(function () {
                        deferred.resolve(teams);
                    });
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
                var teams = teamTags && teamTags.length > 0 ? {} : null;
                angular.forEach(teamTags, function (teamTag) {
                    teams[teamTag.team.id] = teamTag.team;
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
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
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

                deferred.resolve(tagList);
                return deferred.promise;
            },

            /**
             * Takes the response that comes back from a fetch for
             * team tags, into the same structure that comes back from
             * a fetch for getActiveOrAllTeamsForClient() call.
             *
             * @param filteredTeamTags the filtered response
             * @param allTeams all possible teams with tags
             * @returns {Array}
             */
            filteredTeamsAsAllTeams: function (filteredTeamTags, allTeams) {
                var filteredTeamsMap = {};
                angular.forEach(filteredTeamTags, function (filteredTeamTag) {
                    if (!filteredTeamsMap[filteredTeamTag.team.id]){
                        filteredTeamsMap[filteredTeamTag.team.id] = {
                            team: filteredTeamTag.team
                        }
                    }
                });

                // add the tags from the matching 'allTeam' to the filtered tags
                angular.forEach(allTeams, function (allTeam){
                    if (filteredTeamsMap[allTeam.id]){
                        filteredTeamsMap[allTeam.id].tagIds = allTeam.tagIds;
                        filteredTeamsMap[allTeam.id].tags = allTeam.tags;
                    }
                });

                // make an array of the filtered teams in the 'allTeam' structure
                var filteredTeamsList = [];
                angular.forEach(filteredTeamsMap, function (filteredTeam){
                    filteredTeamsList.push({
                        id: filteredTeam.team.id,
                        name: filteredTeam.team.name,
                        tagIds: filteredTeam.tagIds,
                        tags: filteredTeam.tags
                    });
                });
                return filteredTeamsList;
            },

            /**
             * This method takes an array of teams with tags and splits/categorizes
             * those teams based upon the tagsForGroup.
             *
             * @param teamsWithTags an Array of {name: 'group name', tagIds: [id], tags: {id: tag}}
             * @param tagsForGroup an Array of {id: groupId, name: groupName, group: {theGroup}}
             * @returns {{listOfTeamsByTag: Array, listOfTeamsNotInGroup: Array}}
             */
            categorizeTagsByGroup: function(teamsWithTags, tagsForGroup){
                var teamsInGroup = {},
                    teamsNotInGroup = {};
                // first segment teams by ones that are in the group vs. not in the group
                angular.forEach(teamsWithTags, function (aTeam) {
                    var teamHasTagWithinGroup = false;
                    angular.forEach(tagsForGroup, function (groupTag) {
                        if (aTeam.tagIds.indexOf(groupTag.id) !== -1) {
                            teamHasTagWithinGroup = true;
                        }
                    });
                    if (teamHasTagWithinGroup) {
                        teamsInGroup[aTeam.id] = aTeam;
                    } else {
                        teamsNotInGroup[aTeam.id] = aTeam;
                    }
                });

                // from the teams in group, build tag centric model
                var teamsByTags = {};
                angular.forEach(teamsInGroup, function (teamInGroup) {
                    angular.forEach(teamInGroup.tags, function (tagInTeam) {
                        // make sure tag is in group tag
                        var tagIsInGroup = false;
                        angular.forEach(tagsForGroup, function (groupTag) {
                            if (tagInTeam.id === groupTag.id) {
                                tagIsInGroup = true;
                            }
                        });
                        if (tagIsInGroup) {
                            // tag is in group, add team to that tag
                            if (!teamsByTags[tagInTeam.id]) {
                                teamsByTags[tagInTeam.id] = {
                                    tag: tagInTeam,
                                    teams: []
                                };
                            }
                            teamsByTags[tagInTeam.id].teams.push(teamInGroup);
                        }
                    });
                });

                // convert objects to arrays for easier rendering/sorting
                var listOfTeamsByTag = [],
                    listOfTeamsNotInGroup = [];
                angular.forEach(teamsByTags, function (teamsByTag) {
                    listOfTeamsByTag.push({
                        name: teamsByTag.tag.name,
                        teams: teamsByTag.teams
                    });
                });
                angular.forEach(teamsNotInGroup, function (teamNotInGroup) {
                    listOfTeamsNotInGroup.push(teamNotInGroup);
                });
                return {
                    listOfTeamsByTag: listOfTeamsByTag,
                    listOfTeamsNotInGroup: listOfTeamsNotInGroup
                }
            }
        };
    })
;
