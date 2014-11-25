'use strict';

angular.module('emmiManager')

    .service('TeamProviderService', function ($http, $q, Session, UriTemplate) {
        return {
        	 updateTeamProvider: function (scope) {
        		 return $http.post(UriTemplate.create(scope.teamProviderToBeEdit.link.updateTeamProvider).stringify(), scope.teamProviderTeamLocationSaveRequest)
                 	.success(function(response) {
                 		return response.data;
                 });
             },
             getTeamLocationsByTeamProvider: function(url){
            	 var teamLocations = [];
                 return $http.get(UriTemplate.create(url).stringify())
                 	.then(function addToResponseArray(response) {
                 		angular.forEach(response.data.content, function(teamProviderTeamLocation) {
                 			teamLocations.push(teamProviderTeamLocation);
	                    });
	                    if (response.data.link && response.data.link['page-next']) {
	                    	$http.get(response.data.link['page-next']).then(function (response) {
                                addToResponseArray(response);
                            });
	                    }
	                    return teamLocations;
                 	});
             },
             findClientProviderByClientIdAndProviderId: function(scope){
            	 return $http.get(UriTemplate.create(scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).stringify()).then(function load(response) {
                    return response.data;
                });
             }
        };
    })

;