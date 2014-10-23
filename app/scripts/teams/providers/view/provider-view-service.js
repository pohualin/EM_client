'use strict';

angular.module('emmiManager')

    .service('ProviderView', function ($http, $q, Session, UriTemplate, arrays) {
        return {
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
                 return $http.get(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamResource.entity).then(function addToProviders(response) {
                	 var page = response.data;
                    	 angular.forEach(page.content, function(teamProvider){
                    		 providers.push(teamProvider);

	            		 });
                    	 if (page.link && page.link['page-next']) {
	                            $http.get(page.link['page-next']).then(function (response) {
	                            	addToProviders(response);
	                            });
	                        }
	            		 return providers;
                 });
             },
             removeProvider: function (provider, teamResource) {
             	provider.link = arrays.convertToObject('rel', 'href', provider.link);
             	 return $http.delete(UriTemplate.create(provider.link.findProviderById).stringify());
             }
        };
    })

    ;