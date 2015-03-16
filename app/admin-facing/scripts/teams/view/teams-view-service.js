'use strict';
angular.module('emmiManager')
    .service('ViewTeam', function ($http, $q, Session, UriTemplate, $location) {
    	var selectedTeam;
    	return {
    	    viewTeam: function (teamEntity) {
                $location.path('/clients/' + teamEntity.client.id).search('team', teamEntity.id);
            },
            selectTeam: function (url, teamId) {
                return $http.get(UriTemplate.create(url).stringify({id: teamId}))
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
