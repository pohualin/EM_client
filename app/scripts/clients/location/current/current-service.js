'use strict';
angular.module('emmiManager')
    .service('ClientLocationService', ['$http', 'Session', 'UriTemplate',
        function ($http, Session, UriTemplate) {
            return {
                findTeamsUsing: function (clientLocationResource) {
                    var responseArray = [];
                    return $http.get(UriTemplate.create(clientLocationResource.link.teams).stringify())
                        .then(function addToResponseArray(response) {
                            angular.forEach(response.data.content, function (teamResource) {
                                responseArray.push(teamResource.entity);
                            });
                            if (response.data.link && response.data.link['page-next']) {
                                $http.get(response.data.link['page-next']).then(function (response) {
                                    addToResponseArray(response);
                                });
                            }
                            return responseArray;
                        });
                }
            };
        }])
;
