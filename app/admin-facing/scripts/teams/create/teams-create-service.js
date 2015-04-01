'use strict';
angular.module('emmiManager')
    .service('CreateTeam', function ($http, $q, Session, UriTemplate) {
        return {
            newTeam: function () {
                var selectedTeam = {
                    entity: {
                        'name': null,
                        'description': null,
                        'active': true,
                        'phone': null,
                        'fax': null,
                        'client': {
                            'id': null
                        },
                        'normalizedTeamName': null
                    }
                };
                return selectedTeam;
            },
            insertTeams: function (clientResource, team) {
                return $http.post(UriTemplate.create(clientResource.link.teams).stringify(), team).
                    then(function (response) {
                        return response;
                    });
            },
            findNormalizedName: function (url, searchString, clientId) {
                return $http.get(UriTemplate.create(url).stringify({
                        clientId: clientId,
                        normalizedName: searchString
                    }
                )).then(function (response) {
                    return response.data;
                });
            }
        };
    })

;
