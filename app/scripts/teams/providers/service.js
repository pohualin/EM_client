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
             getTeamLocationsByTeamProvider: function(scope){
            	 return $http.get(UriTemplate.create(scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).stringify()).then(function load(response) {
             		if (response.data !== '') {
             			 scope.existingTeamLocations = {};
                         angular.forEach(response.data, function (teamLocation) {
                             scope.existingTeamLocations[teamLocation.entity.id] = angular.copy(teamLocation);
                         });
                     } else {
                    	 scope.existingTeamLocations = {};
                     }
                     return response.data;
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