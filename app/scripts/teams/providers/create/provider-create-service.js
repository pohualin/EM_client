'use strict';

angular.module('emmiManager')

    .service('ProviderCreate', function ($http, $q, Session, UriTemplate) {
        return {
        	 newProvider: function () {
                 return {
                     firstName: null,
                     middleName: null,
                     lastName: null,
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
            	 if(teamResource.link.providerReferenceData){
	            	 var responseArray = [];
	            	 return $http.get(UriTemplate.create(teamResource.link.providerReferenceData).stringify()).then(function addToResponseArray(response){
	            		 angular.forEach(response.data.content, function(specialty){
	            			 responseArray.push(specialty.entity);
	            		 });
	            		 if (response.data.link && response.data.link['page-next']) {
	                            $http.get(response.data.link['page-next']).then(function (response) {
	                            	addToResponseArray(response);
	                            });
	                        }
	            		 return responseArray;
	            	 });
            	 } else {
            		 return null;
            	}
             },
             allProvidersForTeam: function (teamResource) {
            	 var providers = [];
                 return $http.get(UriTemplate.create(teamResource.link.provider).stringify()).then(function addToProviders(response) {
                	 var page = response.data;
                    	 angular.forEach(page.content, function(provider){
                    		 providers.push(provider);
	            		 });
                    	 if (page.link && page.link['page-next']) {
	                            $http.get(page.link['page-next']).then(function (response) {
	                            	addToProviders(response);
	                            });
	                        }
	            		 return providers;
                 });
             }
        };
    })

;