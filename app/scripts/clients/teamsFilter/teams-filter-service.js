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
                    if (teamTag.team.active) {
                        teams[teamTag.team.name] = teamTag.team;
                    }
                });

                deferred.resolve(teams);
                return deferred.promise;
            },
            getInactiveTeamsFromTeamTags: function (teamTags) {
                var deferred = $q.defer();
                var teams = {};

                angular.forEach(teamTags, function (teamTag) {
                    if (!teamTag.team.active) {
                        teams[teamTag.team.name] = teamTag.team;
                    }
                });

                deferred.resolve(teams);
                return deferred.promise;
            },

            getClientTeams: function () {
                var teams = [];
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify()).then(function load(response) {
                    var page = response.data;
                    angular.forEach(page.content, function (team) {
                        teams.push(team);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    return teams;
                });
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

            getTeamsForTags: function (clientTeamTags, tags) {
                var deferred = $q.defer();
                var listOfTeamsByTag = {};
                var teams = [];

                //get all the active teams that have a tag in tags
                angular.forEach(tags, function (tag) {
                    angular.forEach(clientTeamTags, function (teamTag) {
                        if (teamTag.tag.id === tag.id && teamTag.team.active) {
                            teams.push(teamTag.team);
                        }
                    });
                    teams.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    listOfTeamsByTag[tag.name] = teams;
                    teams = [];
                });

                //check if object is empty
                if (Object.keys(listOfTeamsByTag).length === 0) {
                    listOfTeamsByTag = null;
                }
                deferred.resolve(listOfTeamsByTag);
                return deferred.promise;
            },

            getActiveAndInactiveTeamsForTags: function (clientTeamTags, tags) {
                var deferred = $q.defer();
                var listOfTeamsByTag = {};
                var teams = [];

                //get all the active and inactive teams that have a tag in tags
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

                //check if object is empty
                if (Object.keys(listOfTeamsByTag).length === 0) {
                    listOfTeamsByTag = null;
                }

                deferred.resolve(listOfTeamsByTag);
                return deferred.promise;
            },

            getTeamsNotInGroup: function (clientTeamTags, listOfGroupTeamsByTag) {
                //organize clientTeamTags by team
                var listOfClientTagsGroupedByTeams = {};
                var tags = [];
                var teams = {};
                angular.forEach(clientTeamTags, function (teamTag) {
                    if (listOfClientTagsGroupedByTeams[teamTag.team.name]) {
                        tags = listOfClientTagsGroupedByTeams[teamTag.team.name];
                        tags.push(teamTag.tag);
                    } else {
                        tags.push(teamTag.tag);
                    }
                    listOfClientTagsGroupedByTeams[teamTag.team.name] = tags;
                    tags = [];
                    teams[teamTag.team.name] = teamTag.team;
                });

                //get teams that don't have tags in selected group
                var teamsWithTagNotInGroup = [];
                angular.forEach(Object.keys(listOfClientTagsGroupedByTeams), function (clientTeamName) {
                    var skip = false;
                    angular.forEach(listOfClientTagsGroupedByTeams[clientTeamName], function (tag) {
                        angular.forEach(Object.keys(listOfGroupTeamsByTag), function (groupTagName) {
                            if (tag.name === groupTagName) {
                                skip = true;
                            }
                        });
                    });
                    if (!skip) {
                        teamsWithTagNotInGroup.push(clientTeamName);
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

                //get all teamtags that have a filtered tag
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

                //get all tags that are in the selected group and in the filtered tags list
                angular.forEach(groupTags, function (groupTag) {
                    angular.forEach(filteredTags, function (filteredTag) {
                        if (filteredTag.name === groupTag.name) {
                            tagsToReturn.push(groupTag);
                        }
                    });
                });

                deferred.resolve(tagsToReturn);
                return deferred.promise;

            },

            getTeamsWithNoTeamTags: function () {
                var deferred = $q.defer();
                var teams = [];

                $http.get(UriTemplate.create(Client.getClient().link.teamsWithNoTeamTags).stringify()).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    angular.forEach(page.content, function (team) {
                        teams.push(team.entity);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    if (teams.length === 0) {
                        teams = null;
                    }
                    deferred.resolve(teams);
                });
                return deferred.promise;
            }
        };
    })
;
