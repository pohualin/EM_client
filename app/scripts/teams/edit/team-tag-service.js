'use strict';
angular.module('emmiManager')
    .service('TeamTag', function ($http, $q, Session, UriTemplate) {
        return {
            loadTags: function (clientResource) {
                if (clientResource.entity.id) {
                    clientResource.tagGroups = [];
                    return $http.get(UriTemplate.create(clientResource.link.groups).stringify()).then(function load(response) {

                        var page = response.data;
                        angular.forEach(page.content, function (group) {
                            var localGroup = angular.copy(group);
                            localGroup.entity.title = localGroup.entity.name;
                            localGroup.tag = null;
                            angular.forEach(group.entity.tag, function (tag) {
                                tag.group = localGroup.entity;
                                tag.text = tag.name;
                                clientResource.tagGroups.push(tag);
                            });

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
            loadSelectedTags: function (teamResource) {
                if (teamResource.entity.id) {
                    teamResource.tags = [];
                    return $http.get(UriTemplate.create(teamResource.link.tags).stringify()).then(function load(response) {
                        var page = response.data;
                        angular.forEach(page.content, function (teamTag) {
                            teamResource.tags.push(teamTag.entity.tag);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        return teamResource.tags;
                    });
                }
            },
            save: function (teamResource) {
                return $http.post(UriTemplate.create(teamResource.link.tags).stringify(), teamResource.tags).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })
;
