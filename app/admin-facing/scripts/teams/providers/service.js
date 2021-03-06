'use strict';

angular.module('emmiManager')

    .service('TeamProviderService', ['$http', '$q', 'Session', 'UriTemplate', 'ProviderView', 'CommonService',
        function ($http, $q, Session, UriTemplate, ProviderView, CommonService) {
        return {
        	 updateTeamProvider: function (url, teamProviderTeamLocationSaveRequest) {
        		 return $http.post(UriTemplate.create(url).stringify(), teamProviderTeamLocationSaveRequest)
                 	.success(function(response) {
                 		return response.data;
                 });
             },
             getTeamLocationsByTeamProvider: function(url){
                 var deferred = $q.defer();
            	 var teamLocations = [];
                 $http.get(UriTemplate.create(url).stringify())
                 	.then(function addToResponseArray(response) {
                 		angular.forEach(response.data.content, function(teamProviderTeamLocation) {
                 			teamLocations.push(teamProviderTeamLocation);
	                    });
	                    if (response.data.link && response.data.link['page-next']) {
	                    	$http.get(response.data.link['page-next']).then(function (response) {
                                addToResponseArray(response);
                            });
	                    }
                        else {
                            deferred.resolve(teamLocations);
                        }
                 	});
                 return deferred.promise;
             },
             findClientProviderByClientIdAndProviderId: function(url){
            	 return $http.get(UriTemplate.create(url).stringify()).then(function load(response) {
                    return response.data;
                });
             },
             buildMultiSelectData: function(teamLocations){
             	var options = [];
             	angular.forEach(teamLocations, function(teamLocation){
             		var option = new Object({});
             		option.id = teamLocation.entity.id;
             		option.label = teamLocation.entity.location.name;
             		option.teamLocation = teamLocation;
             		options.push(option);
             	});
             	return options;
             },
             buildSelectedItem: function(teamProviderTeamLocations){
             	var options = [];
             	angular.forEach(teamProviderTeamLocations, function(teamProviderTeamLocation){
             		var option = new Object({});
             		option.id = teamProviderTeamLocation.teamLocation.entity.id;
             		option.label = teamProviderTeamLocation.teamLocation.entity.location.name;
             		option.teamLocation = teamProviderTeamLocation.teamLocation;
             		option.teamProviderTeamLocation = teamProviderTeamLocation;
             		options.push(option);
             	});
             	return options;
             },
             composeTeamProviderTeamLocationSaveRequest: function(selectedItems, multiSelectData, teamProvider, teamProviderToBeEdit, clientProvider){
            	// Compose teamProviderTeamLocationSaveRequest
            	var teamProviderTeamLocationSaveRequest = {};
            	// Push all selectedItems to teamProviderTeamLocation only if selectedItems != select all
            	var teamLocations = [];
            	if(selectedItems.length > 0 && selectedItems.length !== multiSelectData.length){
            		angular.forEach(selectedItems, function(selected){
            			teamLocations.push(selected.teamLocation.entity);
	            	});
            	}
            	// Set provider and teamProviderTeamLocation to teamProviderTeamLocationSaveRequest
            	teamProviderTeamLocationSaveRequest.provider = teamProviderToBeEdit.entity.provider;
            	teamProviderTeamLocationSaveRequest.teamProvider = teamProviderToBeEdit.entity;
            	teamProviderTeamLocationSaveRequest.teamLocations = teamLocations;
            	if(clientProvider){
            		teamProviderTeamLocationSaveRequest.clientProvider = clientProvider;
                    teamProviderTeamLocationSaveRequest.provider.active = teamProviderTeamLocationSaveRequest.clientProvider.provider.entity.active;
            	}
            	return teamProviderTeamLocationSaveRequest;
             },
             buildMultiSelectProvidersData: function(teamResource){
            	 var deferred = $q.defer();
            	 ProviderView.allProvidersForTeam(teamResource).then(function(response){
            		 var options = [];
            		 angular.forEach(response, function(provider){
            			 var option = {} ;
            			 option.id = provider.entity.id;
            			 option.label = provider.entity.provider.firstName + ' ' + provider.entity.provider.lastName;
            			 option.provider = provider.entity.provider;
            			 options.push(option);
            		 });
            		 deferred.resolve(options);
            	 });
            	 return deferred.promise;
             },
             /**
              * Get possible (client) providers to associate to a team
              */
             getPossibleClientProviders: function(teamResource, sort){
                 return $http.get(UriTemplate.create(teamResource.link.possibleClientProviders).stringify({
                         sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''    
                     })).then(function(response){
                     CommonService.convertPageContentLinks(response.data);
                     return response.data;
                 });
             },
             getTeamProvidersCount: function(teamResource) {
                 return $http.get(UriTemplate.create(teamResource.link.teamProviders).stringify())
                     .then(function(response){
                     if(response.data && response.data.page) {
                         return response.data.page.totalElements;
                     } else {
                         return 0;
                     }
                 });
             },
        };
    }]);
