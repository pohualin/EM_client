'use strict';
angular.module('emmiManager')
    .service('TeamTag', function ($http, $q, Session, UriTemplate, CommonService) {
        return {
            loadSelectedTags: function (teamResource) {
                if (teamResource.entity.id) {
                    teamResource.tags = [];
                    return $http.get(UriTemplate.create(teamResource.link.tags).stringify()).then(function load(response) {
                        var page = response.data;
                        CommonService.convertPageContentLinks(page);
                        angular.forEach(page.content, function (teamTag) {
                            teamResource.tags.push(teamTag.entity.tag);
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        teamResource.checkTagsForChanges = teamResource.tags;
                        return teamResource.tags;
                    });
                }
            },
            save: function (teamResource) {
                var tags = teamResource.tags || [];
                var tagsCopy = angular.copy(tags);
                angular.forEach(tagsCopy, function(tag){
                    delete tag.text;
                    delete tag.group;
                });
                return $http.post(UriTemplate.create(teamResource.link.tags).stringify(), tagsCopy).
                    then(function (response) {
                        return response;
                    });
            },
            deleteSingleTeamTag: function(teamResource){
                return $http.delete(UriTemplate.create(teamResource.link.teamTag).stringify(), teamResource.tags).
                    then(function (response) {
                        return response;
                    });
            },
            isExistingTagRemoved: function(existingTags, updatedTags){
                var deferred = $q.defer();
                var updatedTagIds = [];
                var isRemove = false;
                angular.forEach(updatedTags, function(tag){
                    if(tag.id){
                        updatedTagIds.push(tag.id);
                    }
                });
                
                angular.forEach(existingTags, function(tag){
                    if(updatedTagIds.indexOf(tag.id) === -1){
                        isRemove = true;
                    }
                });
                
                deferred.resolve(isRemove);
                return deferred.promise;
            }
        };
    })
;
