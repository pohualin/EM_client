'use strict';
angular.module('emmiManager')
    .service('TeamLocation', ['$http', '$q', 'UriTemplate', 'arrays','CommonService', function ($http, $q, UriTemplate, arrays, CommonService) {
        return {
            loadTeamLocationsSimple: function (url) {
                return $http.get(UriTemplate.create(url).stringify()).then(function load(response) {
                    var page = response.data;
                    CommonService.convertPageContentLinks(page);
                    return page;
                });
            },
            removeLocation: function (locationResource) {
                return $http.delete(UriTemplate.create(locationResource.link.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            updateTPTL: function (url, request) {
                return $http.post(UriTemplate.create(url).stringify(), request).
                    then(function (response) {
                        return response;
                    });
            },            
            getTeamLocations: function(url){
                var deferred = $q.defer();
            	var teamLocations = [];
            	$http.get(UriTemplate.create(url).stringify())
            		.then(function addToResponseArray(response) {
                		angular.forEach(response.data.content, function(teamLocation) {
                			teamLocations.push(teamLocation);
	                    });
	                    if (response.data.link && response.data.link['page-next']) {
	                    	$http.get(response.data.link['page-next']).then(function (response) {
                               addToResponseArray(response);
                           });
	                    } else {
	                    	deferred.resolve(teamLocations);
	                    }
                	});
            	return deferred.promise;
            },
            
            getTeamLocationsCount: function(teamResource) {
                return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify())
                    .then(function(response){
                    if(response.data && response.data.page) {
                        return response.data.page.totalElements;
                    } else {
                        return 0;
                    }
                });
            },
            
            /**
             * Get possible (client) locations to associate to a team
             */
            getPossibleClientLocations: function(teamResource, sort){
                return $http.get(UriTemplate.create(teamResource.link.possibleClientLocations).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''    
                    })).then(function(response){
                    CommonService.convertPageContentLinks(response.data);
                    return response.data;
                });
            }
        };
    }])
;
