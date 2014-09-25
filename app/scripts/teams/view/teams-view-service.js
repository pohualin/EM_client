'use strict';
angular.module('emmiManager')
    .service('ViewTeam', function ($http, $q, Session, UriTemplate, $location) {
    	var selectedTeam;
    	return {
    	    viewTeam: function (teamEntity) {
                $location.path('/teams/' + teamEntity.id + '/view');
            },
            selectTeam: function (teamId) {
                return $http.get(UriTemplate.create(Session.link.teamByTeamId).stringify({id: teamId}))
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