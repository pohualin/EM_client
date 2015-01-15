'use strict';

angular.module('emmiManager')

	.service('ProviderSearch', function ($http, $q, Session, UriTemplate, CommonService, arrays, TeamLocation, TeamProviderService) {
        var referenceData;
		return {
			search: function(teamResource, query, status, sort, pageSize){
				var possibleProviders;
				var allTeamLocations;
				var deferred = $q.defer();
				$q.all([
			            $http.get(UriTemplate.create(teamResource.link.possibleProviders).stringify({name: query,
			                        status: status,
			                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
			                        size: pageSize
							})).then(function(response){
								possibleProviders = response.data;
							}),
						TeamLocation.getTeamLocations(teamResource.link.teamLocations).then(function(locationsResponse){
						            allTeamLocations = TeamProviderService.buildMultiSelectData(locationsResponse);
						        })
				        ]).then(function () {
							angular.forEach(possibleProviders.content, function(provider){
				    			provider.provider.entity.selectedTeamLocations = angular.copy(allTeamLocations);
				    		});
							deferred.resolve(possibleProviders);
							});
				return deferred.promise;
			},
			/**
			 * Search method called from home page provider search
			 */
			searchFromHomePage: function (query, status, sort, pageSize) {
				return $http.get(UriTemplate.create(Session.link.providers).stringify({name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
				})).then(function (response) {
					CommonService.convertPageContentLinks(response.data);
					return response.data;
				});
			},
			getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.providersReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            fetchPage: function (href) {
              return $http.get(href).then(function (response) {
            	      CommonService.convertPageContentLinks(response.data);
                      return response.data;
                  });
            },
            fetchPageLink: function (href) {
                return $http.get(href)
                    .then(function (response) {
                    	CommonService.convertPageContentLinks(response.data);
                        return response.data;
                    });
            },
          	fetchLocationsForTeam : function (teamResource) {
        		return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify())
                .success(function (response) {
                    return response;
                });
        	},
        	fetchAllLocationsForTeam : function (teamResource) {
        		var deferred = $q.defer();
        		var responseArray = [];
        		$http.get(UriTemplate.create(teamResource.link.teamLocations).stringify()).then(function addToLocations(response) {
                	var page = response.data;
                	 angular.forEach(response.data.content, function(location){
            			 responseArray.push(location.entity.location);
            		 });
                	 if (page.link && page.link['page-next']) {
                         $http.get(page.link['page-next']).then(function (response) {
                        	 addToLocations(response);
                         });
                     } else {
                    	 deferred.resolve(responseArray);
                     } 
                });
        		return deferred.promise;
        	},
            updateProviderTeamAssociations: function (teamProviderTeamLocationSaveReq, teamResource) {
            	var deferred = $q.defer();
            	$http.post(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamProviderTeamLocationSaveReq)
                    .then(function (response) {
                    	$http.get(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamResource.entity).then(function addToProviders(response) {
                            	 var page = response.data;
                            	 CommonService.convertPageContentLinks(response.data);
                                	 angular.forEach(page.content, function(teamProvider){
                                		 var locations = [];
                                		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                                			 locations.push(' '+ tptl.teamLocation.location.name);
                                		 });
                                		 teamProvider.entity.locations = locations.length > 0 ? locations.sort().toString() : '';
            	            		 });
//                                	 return page;
                                	 deferred.resolve(page);
                             });
                    });
                return deferred.promise;
            },
        	assignLocationsForFetchedProviders: function (page, teamResource) {
            	return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify()).then(function(locations){
         			var allLocationsForTeam = [];
                 	angular.forEach(locations.data.content, function(location){
                 		allLocationsForTeam.push(' '+ location.entity.location.name);
                 	});
                 	 angular.forEach(page.content, function(teamProvider){
                 		 var existinglocations = [];
                 		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                 			existinglocations.push(' '+ tptl.teamLocation.location.name);
                 		 });
                 		 teamProvider.entity.locations = existinglocations.length > 0 ? existinglocations.toString() : (allLocationsForTeam && allLocationsForTeam.length > 0 ) ? allLocationsForTeam.toString(): '';
                 		 teamProvider.link = arrays.convertToObject('rel', 'href', teamProvider.link);
                 	 });
                 	 return page;
            	});
            },
		};
	})

;
