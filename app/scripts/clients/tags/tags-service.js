'use strict';
angular.module('emmiManager')
    .service('Tag', function ($http, $q, Session, UriTemplate) {
        return {
            insertGroups: function (clientResource) {
                if (clientResource) {
                    var groupSaveRequests = [];
                    angular.forEach(clientResource.entity.tagGroups, function (groupToSave) {
                        angular.forEach(groupToSave.tags, function (t) {
                            t.name = t.text;
                        });
                        groupSaveRequests.push({
                            group: {
                                id: groupToSave.id,
                                version: groupToSave.version,
                                name: groupToSave.title,
                                type: groupToSave.entity ? groupToSave.entity.type : groupToSave.type
                            },
                            tags: groupToSave.tags
                        });
                    });
                    return $http.post(UriTemplate.create(clientResource.link.groups).stringify(), groupSaveRequests).then(function (response) {
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
            }
        };
    })
;
