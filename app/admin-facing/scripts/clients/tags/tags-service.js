/* global angular, console */

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
                    var tags = [];
                    return $http.get(UriTemplate.create(clientResource.link.groups).stringify()).then(function load(response) {
                        var page = response.data;
                        angular.forEach(page.content, function (group) {
                            group.entity.title = group.entity.name;
                            group.entity.tags = group.entity.tag;
                            angular.forEach(group.entity.tags, function (tag) {
                                tag.text = tag.name;
                            });
                            tags.push(group.entity);
                        });

                        if (page.link && page.link['page-next']) {
                            return $http.get(page.link['page-next']).then(function (response) {
                                return load(response);
                            });
                        }
                        clientResource.tagGroups = tags;
                        return tags;
                    });
                }
            },
            loadReferenceTags: function (group) {
                var referenceTags = [];

                return $http.get(UriTemplate.create(group.link.refTagsForGroup).stringify()).then(function getTags(tagsResponse) {
                    CommonService.convertPageContentLinks(tagsResponse.data);
                    angular.forEach(tagsResponse.data.content, function (tag) {
                        tag.text = tag.entity.name;
                        referenceTags.push(tag);
                    });
                    if (tagsResponse.data.link && tagsResponse.data.link['page-next']) {
                        return $http.get(tagsResponse.data.link['page-next']).then(function (tagsResponsePage) {
                            return getTags(tagsResponsePage);
                        });
                    }
                    return referenceTags;
                });
            },
            loadReferenceData: function () {
                var responseArray = [];
                return $http.get(UriTemplate.create(Session.link.refDataGroups).stringify()).then(function iterateRefGroupPage(response) {
                    CommonService.convertPageContentLinks(response.data);
                    angular.forEach(response.data.content, function (group) {
                        group.title = group.entity.name;
                        responseArray.push(group);
                    });

                    if (response.data.link && response.data.link['page-next']) {
                        return $http.get(response.data.link['page-next']).then(function (response) {
                            return iterateRefGroupPage(response);
                        });
                    }
                    return responseArray;
                });
            },
            loadActiveReferenceGroups: function () {
                var responseArray = [];
                return $http.get(UriTemplate.create(Session.link.activeReferenceGroups).stringify()).then(function iterateRefGroupPage(response) {
                    CommonService.convertPageContentLinks(response.data);
                    angular.forEach(response.data.content, function (group) {
                        group.title = group.entity.name;
                        responseArray.push(group);
                    });

                    if (response.data.link && response.data.link['page-next']) {
                        return $http.get(response.data.link['page-next']).then(function (response) {
                            return iterateRefGroupPage(response);
                        });
                    }
                    return responseArray;
                });
            },
            createReferenceGroup: function (groupToSave) {
                if (groupToSave) {
                    angular.forEach(groupToSave.tags, function (t) {
                        t.name = t.text;
                    });
                    var data = {
                        referenceTags: groupToSave.tags,
                        referenceGroup: {
                            name: groupToSave.title
                        }
                    };
                    return $http.post(
                        UriTemplate.create(Session.link.refDataGroups).stringify(),
                        data).then(function (response) {
                            return response.data;
                        });
                }
            },
            updateReferenceGroup: function (groupToSave) {
                if (groupToSave) {
                    angular.forEach(groupToSave.tags, function (t) {
                        if (t.entity) {
                            t.id = t.entity.id;
                        }
                        t.name = t.text;
                    });
                    var data = {
                        referenceTags: groupToSave.tags,
                        referenceGroup: {
                            id: groupToSave.entity.id,
                            name: groupToSave.title,
                            active: groupToSave.entity.active
                        }
                    };
                    return $http.post(
                        UriTemplate.create(Session.link.refDataGroups).stringify(),
                        data).then(function (response) {
                            return response.data;
                        });
                }
            },
            checkForConflicts: function (clientResource, removedTags) {

                var groupSaveRequests = GroupSaveRequest.create(clientResource);
                var tagMap = {};
                angular.forEach(removedTags, function (removedTag) {
                    tagMap[removedTag.name] = {tag: removedTag.name, numberOfTeams: 0, conflictingTeamIds: []};
                });

                return $http.post(UriTemplate.create(clientResource.link.invalidTeams).stringify(), groupSaveRequests).then(function (response) {
                    angular.forEach(response.data, function (teamTag) {
                        tagMap[teamTag.tag.name].conflictingTeamIds.push(teamTag.team.id);
                        tagMap[teamTag.tag.name].numberOfTeams++;
                    });
                    var numberOfTeamForTagMap = [];
                    angular.forEach(tagMap, function (removedTag) {
                        numberOfTeamForTagMap.push(removedTag);
                    });
                    return numberOfTeamForTagMap;
                });
            },
            listTagsByGroupId: function (groupResource) {
                var tags = [];

                return $http.get(UriTemplate.create(groupResource.link.tags).stringify({
                    sort: 'name,asc'
                })).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);

                    angular.forEach(page.content, function (tag) {
                        tags.push(tag);
                    });

                    if (page.link && page.link['page-next']) {
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
                        });
                    }
                    return tags;
                });
            },
            listTeamsForTagId: function (tagResource) {
                var teams = [];

                return $http.get(UriTemplate.create(tagResource.link.teamTags).stringify({
                    sort: 'name,asc'
                })).then(function load(response) {
                    var page = response.data;

                    angular.forEach(page.content, function (teamTag) {
                        teams.push(teamTag.entity.team);
                    });

                    if (page.link && page.link['page-next']) {
                        return $http.get(page.link['page-next']).then(function (response) {
                            return load(response);
                        });
                    }
                });
            },
            removedTags: function (client) {
                var deferred = $q.defer();
                var tagGroups = [];
                var tags = [];
                var removedTags = [];
                angular.forEach(client.tagGroups, function (tagGroup) {
                    if (tagGroup.id) {
                        tagGroups.push(tagGroup.id);
                    }

                    angular.forEach(tagGroup.tags, function (tag) {
                        if (tag.id) {
                            tags.push(tag.id);
                        }
                    });
                });

                angular.forEach(client.savedGroups, function (savedGroup) {
                    if (tagGroups.indexOf(savedGroup.id) === -1) {
                        angular.forEach(savedGroup.tags, function (tag) {
                            removedTags.push(tag);
                        });
                    } else {
                        angular.forEach(savedGroup.tags, function (tag) {
                            if (tags.indexOf(tag.id) === -1) {
                                removedTags.push(tag);
                            }
                        });
                    }
                });
                deferred.resolve(removedTags);
                return deferred.promise;
            }
        };
    });
