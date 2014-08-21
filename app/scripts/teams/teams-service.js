'use strict';
angular.module('emmiManager')
    .service('Team', function ($http, $q, Session, UriTemplate) {
    	return {
    	    insertTeams: function (team) {
                
               return $http.post(UriTemplate.create(team.client.link.teams).stringify(), team).success(function (response, status) {
                    return response;
                });
    	    }
    	};
}); 	 