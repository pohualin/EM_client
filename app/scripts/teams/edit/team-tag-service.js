'use strict';
angular.module('emmiManager')
    .service('TeamTag', function ($http, $q, Session, UriTemplate) {
        return {
            loadSelectedTags: function (scope) {
                var teamResource = scope.teamClientResource.teamResource
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
                        scope.teamClientResource.teamResource.checkTagsForChanges = teamResource.tags;
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
