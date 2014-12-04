'use strict';
angular.module('emmiManager')
    .service('TeamsFilter', function ($http, $q, UriTemplate, TeamTag, Tag, Client, CommonService) {
        return{
            getClientTeams: function () {
                var teams = [];
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify()).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
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
                var groups = [];
                return $http.get(UriTemplate.create(Client.getClient().link.groups).stringify({
                    sort: 'name,asc'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);

                    angular.forEach(page.content, function (group) {
                        groups.push(group);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    return groups;
                });
            },

            getClientTagsInGroups: function (groups) {
                var clientTagsInGroups = [];
                angular.forEach(groups, function (group) {
                    var localGroup = angular.copy(group.entity);
                    localGroup.title = localGroup.name;
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

            getFilteredTeams: function(filterTags, clientTeams){
                var tags = [];
                var tagAreInMultipleGroups = false;
                var filteredTeams = [];
                angular.forEach(filterTags, function (tag) {
                    tags.push(tag);
                    angular.forEach(tags, function (savedTag) {
                        if (tag.group.id !== savedTag.group.id) {
                            tagAreInMultipleGroups = true;
                        }
                    });
                });

                if (tagAreInMultipleGroups) {
                    //teams that have *all* of those tags will be listed in alphabetical order
                    angular.forEach(clientTeams, function (team) {
                        //for each team on the client get all tags
                        TeamTag.loadSelectedTags(team).then(function (tags) {
                            var saveTeam = false;
                            var skipTheRemainingFilteredTags = false;

                            //find if any of the tags on a team matches a filtered tag
                            angular.forEach(filterTags, function (filteredTag) {
                                if (!skipTheRemainingFilteredTags) {
                                    saveTeam = false;
                                    angular.forEach(tags, function (tag) {
                                        if (tag.id === filteredTag.id) {
                                            saveTeam = true;
                                        }
                                    });
                                    if (!saveTeam) {
                                        skipTheRemainingFilteredTags = true;
                                    }
                                }
                            });
                            if (saveTeam) {
                                filteredTeams.push(team);
                            }
                        });
                    });
                    filteredTeams.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    return filteredTeams;
                } else {
                    // teams that have *any* of those tags will be listed in alphabetical order
                    angular.forEach(clientTeams, function (team) {
                        TeamTag.loadSelectedTags(team).then(function (tags) {
                            angular.forEach(tags, function (tag) {
                                //check if a filtered tag matches a tag on the ClientTeams
                                angular.forEach(filterTags, function (filteredTag) {
                                    if (tag.id === filteredTag.id) {
                                        var saveTeam = true;
                                        angular.forEach(filteredTeams, function (filteredTeam) {
                                            if (team.entity.id === filteredTeam.entity.id) {
                                                //already saved this team
                                                saveTeam = false;
                                            }
                                        });
                                        if (saveTeam) {
                                            filteredTeams.push(team);
                                        }
                                    }
                                });
                            });
                        });
                    });
                    filteredTeams.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    return filteredTeams;
                }
            },

            getTagsForGroup: function(selectedGroup){
                return Tag.listTagsByGroupId(selectedGroup);
            },
            getTeamsForTagsInGroup: function(tagsInSelectedGroup){
                    var listOfTeamLists = [];
                    angular.forEach(tagsInSelectedGroup, function (tag) {
                        Tag.listTeamsForTagId(tag).then(function (teams) {
                            listOfTeamLists.push(teams);
                        });
                    });
                    return listOfTeamLists;
            },
            getFilteredAndGroupedTeamsToShow:function(selectedGroup,filterTags){
                var deferred = $q.defer();
                Tag.listTagsByGroupId(selectedGroup).then(function (tags) {
                    var tagsInSelectedGroupAndFilterTag = [];
                    var saveTag = false;

                    angular.forEach(tags, function (groupTag) {
                        saveTag = false;
                        angular.forEach(filterTags, function (filteredTag) {
                            if (filteredTag.id === groupTag.entity.id) {
                                saveTag = true;
                            }
                        });
                        if (saveTag === true) {
                            tagsInSelectedGroupAndFilterTag.push(groupTag);
                        }
                    });
                    deferred.resolve(tagsInSelectedGroupAndFilterTag);
                });
                return deferred.promise;
            },
            getTeamsForTagsInSelectedGroupAndFilteredTag:function(groupTags){
                var listOfTeamLists = [];
                angular.forEach(groupTags,function(groupTag){
                    Tag.listTeamsForTagId(groupTag).then(function (teams) {
                        listOfTeamLists.push(teams);
                    });
                });
                return listOfTeamLists;
            }
        };
    })
;
