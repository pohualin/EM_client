'use strict';

angular.module('emmiManager')

    .service('ProviderView', function ($http, $q, Session, UriTemplate, arrays) {
    	function convertPageContentLinks(page){
            if (page) {
                angular.forEach(page, function (teamProvider) {
                	teamProvider.link = arrays.convertToObject('rel', 'href', teamProvider.link);
                });
            }
        }
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
             allProvidersForTeam: function (teamResource, allLocations) {
            	 var providers = [];
                 return $http.get(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamResource.entity).then(function addToProviders(response) {
                	 var page = response.data;
                    	 angular.forEach(page.content, function(teamProvider){
                    		 var locations = [];
                    		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                    			 locations.push(' '+ tptl.teamLocation.location.name);
                    		 });
                    		 teamProvider.entity.locations = locations.length > 0 ? locations.toString() : (allLocations && allLocations.length > 0 ) ? allLocations.toString(): '';
                    		 teamProvider.link = arrays.convertToObject('rel', 'href', teamProvider.link);
                    		 providers.push(teamProvider);
	            		 });
                    	 return page;
                 });
             },
             fetchPageLink: function (href) {
                 return $http.get(href)
                     .then(function (response) {
                         convertPageContentLinks(response.data.content);
                         return response.data;
                     });

             },
             removeProvider: function (provider, teamResource) {
             	return $http.delete(UriTemplate.create(provider.link.findProviderById).stringify());
             }
        };
    })

    ;