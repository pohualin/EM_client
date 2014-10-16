'use strict';
angular.module('emmiManager')
    .service('TeamLocation', function ($http, $q, Session, UriTemplate, arrays) {
        return {
            loadTeamLocations: function (scope) {
                var teamResource = scope.teamClientResource.teamResource;
                if (teamResource.entity.id) {
                    teamResource.locations = [];
                    return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify()).then(function load(response) {
                        var page = response.data;
                        angular.forEach(page.content, function (teamLocation) {
                            teamResource.locations.push(teamLocation.entity.location);
                            teamLocation.entity.location.isNewAdd = false;
                            scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);  
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }
                        scope.teamClientResource.teamResource.checkTagsForChanges = teamResource.locations;
                        return teamResource.locations;
                    });
                }
            }

        };
    })
;
