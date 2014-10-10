'use strict';

angular.module('emmiManager')

    .service('ProviderCreate', function ($http, $q, Session, UriTemplate) {
        return {
        	 newProvider: function () {
                 return {
                     firstName: null,
                     middleName: null,
                     lastName: null,
                     gender: null,
                     email: null,
                     specialty: null
                 };
             },
             create: function (provider, teamResource) {
                 return $http.post(UriTemplate.create(teamResource.link.provider).stringify(), provider)
                     .success(function (response) {
                         return response;
                     });
             },
             specialtyRefData: function(teamResource) {
            	 var responseArray = [];
            	 return $http.get(UriTemplate.create(teamResource.link.providerReferenceData).stringify()).then(function (response){
            		 angular.forEach(response.data.content, function(specialty){
            			 responseArray.push(specialty.entity);
            		 });
            		 return responseArray;
            	 });
             },
             allProvidersForTeam: function (teamResource) {
                 return $http.get(UriTemplate.create(teamResource.link.provider).stringify())
                     .success(function (response) {
                         return response;
                     });
             }
             
        };
    })

;