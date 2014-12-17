'use strict';
angular.module('emmiManager')
    .service('TeamsFilter', function ($http, $q, CommonService, UriTemplate, Client) {
        return{
        	/**
        	 * Get a page of Teams for a Client
        	 */
        	getClientTeamsPage: function(client, query) {
        		console.log(query);
        		console.log(UriTemplate.create(client.link.findByClientAndTerm).stringify(
                    	{term: query}));
                return $http.get(UriTemplate.create(client.link.findByClientAndTerm).stringify(
                	{term: query})).then(function (response) {
                    CommonService.convertPageContentLinks(response.data);
                    return response.data;
                });
            },
            
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
