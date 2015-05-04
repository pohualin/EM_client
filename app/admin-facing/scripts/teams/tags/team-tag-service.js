/* global angular, console */
'use strict';
angular.module('emmiManager')
    .service('TeamTag', ['$http', '$q', 'Session', 'UriTemplate', 'CommonService', '$filter',
        function ($http, $q, Session, UriTemplate, CommonService, $filter) {
            return {
                loadSelectedTags: function (teamResource) {

                    var tags = [];
                    return $http.get(UriTemplate.create(teamResource.link.tags).stringify()).then(function load(response) {
                        var page = response.data;
                        CommonService.convertPageContentLinks(page);
                        angular.forEach(page.content, function (teamTag) {
                            tags.push(teamTag.entity.tag);
                        });

                        if (page.link && page.link['page-next']) {
                            return $http.get(page.link['page-next']).then(function (response) {
                                return load(response);
                            });
                        }
                        return tags;
                    });

                },
                save: function (teamResource) {
                    var tags = teamResource.tags || [],
                        tagsCopy = angular.copy(tags),
                        updated = [];
                    angular.forEach(tagsCopy, function (tag) {
                        delete tag.text;
                        delete tag.group;
                    });
                    return $http.post(UriTemplate.create(teamResource.link.tags).stringify(), tagsCopy).
                        then(function (response) {
                            var sortedTeamTags = $filter('orderBy')(response.data, 'id');
                            angular.forEach(sortedTeamTags, function (teamTag) {
                                updated.push(teamTag.tag);
                            });
                            return updated;
                        });
                },
                deleteSingleTeamTag: function (teamResource) {
                    return $http.delete(UriTemplate.create(teamResource.link.teamTag).stringify(), teamResource.tags).
                        then(function (response) {
                            return response;
                        });
                }
            };
        }])
;
