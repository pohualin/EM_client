'use strict';
angular.module('emmiManager')
    .service('TeamLocation', function ($http, $q, $filter, Session, UriTemplate, arrays) {
        return {
            loadTeamLocationsSimple: function (url) {
                return $http.get(UriTemplate.create(url).stringify()).then(function load(response) {
                    return response.data;
                });
            },
            removeLocation: function (locationResource) {
                locationResource.links = arrays.convertToObject('rel', 'href', locationResource.link);
                return $http.delete(UriTemplate.create(locationResource.links.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            getTeamLocations: function(url){
            	var teamLocations = [];
            	return $http.get(UriTemplate.create(url).stringify())
            		.then(function addToResponseArray(response) {
                		angular.forEach(response.data.content, function(teamLocation) {
                			teamLocations.push(teamLocation);
	                    });
	                    if (response.data.link && response.data.link['page-next']) {
	                    	$http.get(response.data.link['page-next']).then(function (response) {
                               addToResponseArray(response);
                           });
	                    }
	                    return teamLocations;
                	});
            }
        };
    })
;
