'use strict';
angular.module('emmiManager')
    .service('TeamsFilter', function ($http, $q, UriTemplate, Client) {
        return{
            getClientTeams: function () {
                var teams = [];
                return $http.get(UriTemplate.create(Client.getClient().link.teams).stringify()).then(function load(response) {
                    var page = response.data;
                    angular.forEach(page.content, function(team){
                        teams.push(team);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    return teams;
                });
            },
            getClientGroups: function(){
                var groups = [];
                return $http.get(UriTemplate.create(Client.getClient().link.groups).stringify({
                    sort:'name,asc'
                })).then(function load(response) {
                    var page = response.data;

                    angular.forEach(page.content, function(group){
                        groups.push(group);
                    });
                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            load(response);
                        });
                    }
                    return groups;
                });
            }
        };
    })
;
