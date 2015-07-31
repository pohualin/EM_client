'use strict';

angular.module('emmiManager')

    .service('ProviderSearch', function ($http, $q, Session, UriTemplate, CommonService, arrays) {
        var referenceData;
		return {
            search: function (allTeamLocations, teamResource, query, status, sort, pageSize) {
                var teams = angular.copy(allTeamLocations);
                return $http.get(UriTemplate.create(teamResource.link.possibleProviders).stringify({
                    name: query,
                    status: status,
                    sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                    size: pageSize
                })).then(function (response, allTeamLocations) {
                    CommonService.convertPageContentLinks(response.data);
                    angular.forEach(response.data.content, function (provider) {
                        provider.provider.entity.selectedTeamLocations = angular.copy(teams);
                    });
                    return response.data;
                });
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
            
            /**
             * Check if all selectedProviders contain at least one TeamLocation if there is any
             */
            isSaveRequestValid: function(allTeamLocations, selectedProviders){
                var deferred = $q.defer();
                var valid = true;
                if(allTeamLocations.length > 0){
                    angular.forEach(selectedProviders, function (provider) {
                        if (provider.selectedTeamLocations.length === 0) {
                            valid = false;
                        }
                    });
                    deferred.resolve(valid);
                } else {
                    deferred.resolve(valid);  
                }
                return deferred.promise;
            },
            
            /**
             * Compose teamProviderTeamLocatioSaveRequest for save calls
             */
            getTeamProviderTeamLocationSaveRequest: function(allTeamLocations, selectedProviders) {
                var teamProviderTeamLocationSaveRequest = [];
                angular.forEach(selectedProviders, function(provider){
                   var request = {provider: {}, teamLocations: []};
                   request.provider = provider;
                   if (allTeamLocations.length !== provider.selectedTeamLocations.length) {
                       request.teamLocations = provider.selectedTeamLocations;
                   }
                   teamProviderTeamLocationSaveRequest.push(request);
                });
                return teamProviderTeamLocationSaveRequest;
            },
            
            /**
             * Associate all (client) providers to a team except those in selectAllBut
             */
            saveAllProvidersExcept: function(teamResource, selectedProviders, teamLocations, selectAllBut){
                var deferred = $q.defer();
                var self = this;
                // Only keep providers with subset of locations
                angular.forEach(selectedProviders, function(provider){
                    if (teamLocations.length === provider.selectedTeamLocations.length){
                        delete selectedProviders[provider.id];
                    }
                });
                
                var providersToAdd = self.getTeamProviderTeamLocationSaveRequest(teamLocations, selectedProviders);
                
                // First save locations with subset of providers
                self.updateProviderTeamAssociations(providersToAdd, teamResource).then(function(response){
                    var excludeSet = [];
                    // collect a set of location ids to be excluded
                    angular.forEach(selectAllBut, function(exclusion){
                        excludeSet.push(exclusion.id);
                    });
                    // associate all locations except the ones in excludeSet
                    $http.post(UriTemplate.create(teamResource.link.associateAllClientProvidersExcept).stringify(), excludeSet).then(function(response){
                        deferred.resolve(providersToAdd);
                    });
                });
                return deferred.promise;
            }
		};
	})

;
