'use strict';

angular.module('emmiManager')

    .service('ScheduleService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {

                loadTeam: function (clientResource, teamId) {
                    return $http.get(UriTemplate.create(clientResource.link.team).stringify({teamId: teamId}))
                        .success(function (response) {
                            return response.data;
                        });
                }
            };
        }])
;
