'use strict';

angular.module('emmiManager').service(
    'LocationService',
    function($http, arrays, Session, UriTemplate) {
    	var selectedLocation;
    	
        return {
            // LocationsResource.get(Long id)
            getLocationById: function(id) {
            	if(selectedLocation){
	        		return $http.get(
	                    UriTemplate.create(selectedLocation.link.self)
	                    .stringify({
	                        id: id
	                    })).then(function(response) {
	                    return response.data;
	                });            		
            	}
            },
            
            // LocationsResource.currentClients(Long id)
            getCurrentClientsByLocation: function(location, pageSize) {
                return $http.get(
                    UriTemplate.create(location.link.clients)
                    .stringify({
                        size: pageSize
                    })).then(function(response) {
                    return response.data;
                });
            },
            
            // LocationsResource.update(Location location)
            updateLocation: function(locationToUpdate) {
                return $http.put(UriTemplate.create(Session.link.locations).stringify(), locationToUpdate)
                    .success(function(response) {
                        return response.data;
                    });
            },
            
            // Set selectedLocation
            setSelectedLocation: function(location){
            	selectedLocation = location;
            },
            
            // Get selectedLocation
            getSelectedLocation: function(){
            	return selectedLocation;
            }
        };
    });