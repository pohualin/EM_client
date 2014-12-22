'use strict';

angular.module('emmiManager')

    .service('ProviderCreate', function ($http, $q, Session, UriTemplate, CommonService) {
        return {
        	 newProvider: function () {
                 return {
                     firstName: null,
                     middleName: null,
                     lastName: null,
                     email: null,
                     specialty: null,
                     'active': true
                 };
             },
             create: function (provider, teamResource) {
                 return $http.post(UriTemplate.create(teamResource.link.provider).stringify(), provider)
                     .success(function (response) {
                         return response;
                     });
             },
             associateTeamLocationsToProvider : function (provider, teamResource, teamLocations){
            	 $http.get(UriTemplate.create(teamResource.link.findTeamProviderByProviderAndTeam).stringify({providerId: provider.id})).then(function(response){
            		var teamProviderResource = response.data;
            		return $http.post(UriTemplate.create(teamProviderResource.link.teamProviderTeamLocation).stringify(), teamLocations).success( function (response){
            			console.log(response);
            			return response;
            		});
            	 });
             }
        };
    })
;