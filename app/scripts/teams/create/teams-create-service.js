'use strict';
angular.module('emmiManager')
    .service('CreateTeam', function ($http, $q, Session, UriTemplate, $location) {
    	var selectedTeam;
    	return {
    	    insertTeams: function (team) {
               return $http.post(UriTemplate.create(Session.link.teamsByClientId).stringify({clientId: team.client.id}), team).
                   then(function (response) {
            	       return response;
                   });
    	    }
    	};
}); 	 