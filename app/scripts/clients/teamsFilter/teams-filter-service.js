'use strict';
angular.module('emmiManager')
    .service('TeamsFilter', function ($http, $q, UriTemplate, TeamTag, Tag, Client, CommonService) {
        return{
            getTeamTags: function (filterTags) {
                var deferred = $q.defer();
                var teamTags = [];
                var tagIds = [];
                angular.forEach(filterTags, function (filterTag) {
                    tagIds.push(filterTag.id);
                });
                $http.get(UriTemplate.create(Client.getClient().link.teamTagsWithTags).stringify({
                        tagIds: tagIds
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

            getTeamsFromTeamTags: function (teamTags) {
                var deferred = $q.defer();
                var teams = {};
                angular.forEach(teamTags, function (teamTag) {
                    teams[teamTag.team.name] = teamTag.team;
                });
                deferred.resolve(teams);
                return deferred.promise;
            },

            getClientGroups: function () {
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

            getClientTagsInGroups: function (groups) {
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

            getTagsForGroup: function (selectedGroup) {
                var deferred = $q.defer();
                var tagList = [];
                if (selectedGroup === null) {
                    deferred.resolve(tagList);
                    return deferred.promise;
                }
                angular.forEach(selectedGroup.entity.tag, function (tag) {
                    tagList.push(tag);
                });
                tagList.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                deferred.resolve(tagList);
                return deferred.promise;
            },

            getTeamsForTags: function (clientTeamTags, tags) {
                var deferred = $q.defer();
                var listOfTeamsByTag = {};
                var teams = [];
                angular.forEach(tags, function (tag) {
                    angular.forEach(clientTeamTags, function (teamTag) {
                        if (teamTag.tag.id === tag.id) {
                            teams.push(teamTag.team);
                        }
                    });
                    teams.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    listOfTeamsByTag[tag.name] = teams;
                    teams = [];
                });
                if (Object.keys(listOfTeamsByTag).length === 0) {
                    listOfTeamsByTag = null;
                }

                deferred.resolve(listOfTeamsByTag);
                return deferred.promise;
            },

            getTeamsNotInGroup: function (clientTeamTags, groupTeamsByTag) {
                var teamsWithTagNotInGroup = {};
                var groupTeams = {};
                //get all teams the will be displayed
                angular.forEach(groupTeamsByTag, function (teams) {
                    angular.forEach(teams, function (team) {
                        groupTeams[team.name] = team;
                    });
                });

                //get each team that is not in the list of teams that will be displayed
                angular.forEach(clientTeamTags, function (clientTeamTag) {
                    var skip = false;
                    angular.forEach(groupTeams, function (groupTeam) {
                        if (clientTeamTag.team.id === groupTeam.id) {
                            skip = true;
                        }
                    });
                    if (!skip) {
                        teamsWithTagNotInGroup[clientTeamTag.team.name] = clientTeamTag.team;
                    }
                });

                //check if object is empty
                if (Object.keys(teamsWithTagNotInGroup).length === 0) {
                    teamsWithTagNotInGroup = null;
                }

                return teamsWithTagNotInGroup;
            },

            getFilteredTeamTags: function (filterTags) {
                var deferred = $q.defer();
                this.getTeamTags(filterTags).then(function (teamTags) {
                    angular.forEach(teamTags, function (teamTag) {
                        teamTags[teamTag.team.name] = teamTag.entity;
                    });
                    deferred.resolve(teamTags);
                });
                return deferred.promise;
            },

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
