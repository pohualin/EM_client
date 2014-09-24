'use strict';
angular.module('emmiManager')
    .service('Team', function ($http, $q, Session, UriTemplate, $location) {
    	var selectedTeam;
    	return {
    	    insertTeams: function (team) {
                
               return $http.post(UriTemplate.create(team.client.link.teams).stringify(), team).success(function (response, status) {
                    return response;
                });
    	    },
    	    getTeam: function () {
                return selectedTeam;
            },
    	    viewTeam: function (teamEntity) {
                $location.path('/teams/' + teamEntity.id + '/view');
            },
            selectTeam: function (teamId) {
                return $http.get(UriTemplate.create(Session.link.teamById).stringify({id: teamId}))
                    .then(function (response) {
                        selectedTeam = response.data;
                        return selectedTeam;
                    });
            },
            setTeam: function (teamResource) {
                selectedTeam = teamResource;
            }
    	};
}); 	 