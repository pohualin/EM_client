'use strict';
angular.module('emmiManager')
    .service('Team', function ($http, $q, Session, UriTemplate, $location) {
    	var selectedTeam;
    	return {
    	    insertTeams: function (team) {
                
               return $http.post(UriTemplate.create(team.client.link.teams).stringify(), team).success(function (response, status) {
            	   //angular.extend(selectedTeam.entity, response.entity);
            	   //selectedTeam.link = response.link;
                    return response;
                });
    	    },
    	    getTeam: function () {
                return selectedTeam;
            },
    	    viewTeam: function (teamEntity) {
                $location.path('/teams/' + teamEntity.id + '/view');
            }
    	};
}); 	 