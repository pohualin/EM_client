'use strict';
angular.module('emmiManager')
    .factory('GroupSaveRequest', function () {
        return {
            create: function (clientResource) {
                var ret = [];
                angular.forEach(clientResource.entity.tagGroups, function (groupToSave) {
                    angular.forEach(groupToSave.tags, function (t) {
                        t.name = t.text;
                    });
                    ret.push({
                        group: {
                            id: groupToSave.id,
                            version: groupToSave.version,
                            name: groupToSave.title,
                            type: groupToSave.entity ? groupToSave.entity.type : groupToSave.type
                        },
                        tags: groupToSave.tags
                    });
                });
                return ret;
            }
        };
    })

    .service('Tag', function ($http, $q, Session, UriTemplate, GroupSaveRequest, CommonService) {
        return {
            insertGroups: function (clientResource) {
                if (clientResource) {
                    return $http.post(UriTemplate.create(clientResource.link.groups).stringify(),
                        GroupSaveRequest.create(clientResource)).then(function (response) {
                            return response.data;
                        });
                }
            },
            loadGroups: function (clientResource) {
                if (clientResource.entity.id) {
                    clientResource.tagGroups = [];
                    return $http.get(UriTemplate.create(clientResource.link.groups).stringify()).then(function load(response) {
                        var page = response.data;
                        angular.forEach(page.content, function (group) {
                            group.entity.title = group.entity.name;
                            group.entity.tags = group.entity.tag;
                            angular.forEach(group.entity.tags, function (tag) {
                                tag.text = tag.name;
                            });
                            clientResource.tagGroups.push(group.entity);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        return clientResource.tagGroups;
                    });
                }
            },
            loadReferenceData: function () {
                var responseArray = [];
                return $http.get(UriTemplate.create(Session.link.refDataGroups).stringify()).then(function iterateRefGroupPage(response) {
                    angular.forEach(response.data.content, function (group) {
                        group.title = group.entity.name;
                        group.tags = group.entity.tag;
                        angular.forEach(group.entity.tag, function (tag) {
                            tag.text = tag.name;
                        });
                        responseArray.push(group);
                    });

                    if (response.data.link && response.data.link['page-next']) {
                        $http.get(response.data.link['page-next']).then(function (response) {
                            iterateRefGroupPage(response);
                        });
                    }
                    return responseArray;
                });
            },
            checkForConflicts: function (clientResource) {
                var groupSaveRequests = GroupSaveRequest.create(clientResource);
                return $http.post(UriTemplate.create(clientResource.link.invalidTeams).stringify(), groupSaveRequests).then(function (response) {
                    var tagMap = {};
                    var conflictingTeamIds = [];
                    var tagNames = [];
                    angular.forEach(response.data, function (teamTag) {
                        if (!tagMap[teamTag.tag.name]) {
                            tagMap[teamTag.tag.name] = 1;
                            tagNames.push(teamTag.tag.name);
                            conflictingTeamIds.push(teamTag.team.id);
                        } else {
                            tagMap[teamTag.tag.name]++;
                        }
                    });
                    var numberOfTeamForTagMap = [];
                    angular.forEach(tagNames, function (tagName) {
                        numberOfTeamForTagMap.push({
                            tag: tagName,
                            conflictingTeamIds: conflictingTeamIds,
                            numberOfTeams: tagMap[tagName]
                        });
                    });
                    return numberOfTeamForTagMap;
                });
            },
            listTagsByGroupId: function (groupResource) {
                if (groupResource) {
                    var deferred = $q.defer();
                    var tags = [];

                    $http.get(UriTemplate.create(groupResource.link.tags).stringify({
                        sort:'name,asc'
                    })).then(function load(response) {
                        var page = response.data;
                        CommonService.convertPageContentLinks(page);

                        angular.forEach(page.content, function (tag) {
                            tags.push(tag);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        deferred.resolve(tags);
                    });
                    return deferred.promise;
                }
            },
            listTeamsForTagId: function (tagResource) {
                if (tagResource) {
                    var deferred = $q.defer();
                    var teams = [];

                    $http.get(UriTemplate.create(tagResource.link.teamTags).stringify({
                        sort:'name,asc'
                    })).then(function load(response) {
                        var page = response.data;

                        angular.forEach(page.content, function (teamTag) {
                            teams.push(teamTag.entity.team);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        deferred.resolve(teams);
                    });
                    return deferred.promise;
                }
            }
        };
    });
