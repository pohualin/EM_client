'use strict';

angular.module('emmiManager')

    .service('ProviderView', function ($http, $q, Session, UriTemplate, arrays, ProviderSearch, CommonService) {
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
             paginatedProvidersForTeam: function (teamResource) {
                 return $http.get(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamResource.entity).then(function addToProviders(response) {
                	 var page = response.data;
                	 CommonService.convertPageContentLinks(response.data);
                    	 angular.forEach(page.content, function(teamProvider){
                    		 var locations = [];
                    		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                    			 locations.push(' '+ tptl.teamLocation.location.name);
                    		 });
                    		 teamProvider.entity.locations = locations.length > 0 ? locations.sort().toString() : '';
	            		 });
                    	 return page;
                 });
             },
             allProvidersForTeam: function (teamResource) {
            	 var deferred = $q.defer();
            	 var providers = [];
                 $http.get(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamResource.entity).then(function addToProviders(response) {
                	 var page = response.data;
                    	 angular.forEach(page.content, function(teamProvider){
                            teamProvider.entity.label = teamProvider.entity.provider.firstName + ' ' + teamProvider.entity.provider.lastName; //do this because the multiselet do not support nested prop
                    		 providers.push(teamProvider);
	            		 });
                    	 if (page.link && page.link['page-next']) {
	                            $http.get(page.link['page-next']).then(function (response) {
	                            	addToProviders(response);
	                            });
	                        } else {
	                        	deferred.resolve(providers);
	                        }
                 });
                 return deferred.promise;
             },            
             fetchPageLink: function (href) {
                 return $http.get(href)
                     .then(function (response) {
                    	 CommonService.convertPageContentLinks(response.data);
                    	 angular.forEach(response.data.content, function(teamProvider){
                    		 var locations = [];
                    		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                    			 locations.push(' '+ tptl.teamLocation.location.name);
                    		 });
                    		 teamProvider.entity.locations = locations.length > 0 ? locations.sort().toString() : '';
	            		 });
                         return response.data;
                     });

             },
             removeProvider: function (provider, teamResource) {
             	return $http.delete(UriTemplate.create(provider.link.findProviderById).stringify());
             },
             convertLinkObjects : function(response){
            	 if(response){
            		 angular.forEach(response, function(content){
            			 content.link = arrays.convertToObject('rel', 'href',
 								content.link);
            		 });
            	 }
             }
        };
    })

    .directive('resetProviderSearch', [function () {
          return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                scope.providerQuery=null;
            }
          };    
    }]) 
    ;