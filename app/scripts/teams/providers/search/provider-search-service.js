'use strict';

angular.module('emmiManager')

	.service('ProviderSearch', function ($http, $q, Session, UriTemplate, CommonService, arrays) {
        var referenceData;
		return {
			search: function (teamResource, query, status, sort, pageSize) {
				return $http.get(UriTemplate.create(teamResource.link.possibleProviders).stringify({name: query,
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
            updateProviderTeamAssociations: function (teamProviderTeamLocationSaveReq, teamResource) {
                return $http.post(UriTemplate.create(teamResource.link.teamProviders).stringify(), teamProviderTeamLocationSaveReq)
                    .success(function (response) {
                        return response;
                    });
            },
        	fetchLocationsForTeam : function (teamResource) {
        		return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify())
                .success(function (response) {
                    return response;
                });
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