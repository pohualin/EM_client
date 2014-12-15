'use strict';
angular.module('emmiManager')

    .service('ClientUsersService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            var referenceData;
            var selectedClientUser;
            return {
                newClientUser: function () {
                	selectedClientUser = {
                        entity: {
                            'firstName': null,
                            'lastName': null,
                            'email': null,
                            'login': null
                        }
                    };
                    return selectedClientUser;
                },
                
                createClientUser: function(client, clientUserToBeEdit){
                	console.log('create client user.');
                	clientUserToBeEdit.login = clientUserToBeEdit.email;
                	clientUserToBeEdit.client = client.entity;
                	return $http.post(UriTemplate.create(client.link.users).stringify(), clientUserToBeEdit)
	                    .success(function(response) {
	                        return response;
	                    });
                },
                
                list: function(client, query, sort){
                	return $http.get(UriTemplate.create(client.link.users).stringify(
                			{term: query,
                			 sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''}))
	                    .then(function(response) {
	                    	CommonService.convertPageContentLinks(response.data);
	                        return response.data;
	                    });
                },
                
                fetchPage: function(href){
                	return $http.get(UriTemplate.create(href).stringify())
	                    .then(function(response) {
	                    	CommonService.convertPageContentLinks(response.data);
	                        return response.data;
	                    });
                },
                
                /**
                 * Call to see if client has any users
                 */
                hasUsers: function(client){
                	var deferred = $q.defer();
                	$http.get(UriTemplate.create(client.link.users).stringify({term: ''}))
	                    .then(function(response) {
	                    	if(response.status === 200){
	                    		deferred.resolve(true);
	                    	} else {
	                    		deferred.resolve(false);
	                    	}
	                    });
                	return deferred.promise;
                }
            };
        }])
;
