'use strict';
angular.module('emmiManager')

    .service('UsersClientService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Client, Session) {
            var referenceData;
            var selectedUserClient;
            return {
            	/**
            	 * Create a new UserClient placeholder
            	 */
                newUserClient: function () {
                	var newUserClient = {
                        entity: {
                            'firstName': null,
                            'lastName': null,
                            'email': null,
                            'login': null
                        }
                    };
                    return newUserClient;
                },
                
                /**
                 * Call server to create UserClient
                 */
                createUserClient: function(client, userClientToBeEdit){
                	console.log('create client user.');
                	userClientToBeEdit.login = userClientToBeEdit.email;
                	userClientToBeEdit.client = client.entity;
                	return $http.post(UriTemplate.create(client.link.users).stringify(), userClientToBeEdit)
	                    .success(function(response) {
	                        return response;
	                    });
                },
                

                /**
                 * Call server to get a list of UserClient
                 */
                list: function(client, query, sort){
                	return $http.get(UriTemplate.create(client.link.users).stringify(
                			{term: query,
                			 sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''}))
	                    .then(function(response) {
	                    	CommonService.convertPageContentLinks(response.data);
	                        return response.data;
	                    });
                },
                
                /**
                 * Call server to fetch next batch of UserClient
                 */
                fetchPage: function(href){
                	return $http.get(UriTemplate.create(href).stringify())
	                    .then(function(response) {
	                    	CommonService.convertPageContentLinks(response.data);
	                        return response.data;
	                    });
                },
                
                /**
                 * Call when UserClientId is passed in as route param
                 * get UserClient by userClientId and set it to selectedUserClient
                 */
                setUserClient: function(userClientId){
                	if(userClientId === null){
                		// Reset selectedUserClient
                		selectedUserClient = null;
                	} else {
                		// Call server to get UserClient by userClientId
                		return $http.get(UriTemplate.create(Session.link.userClientById).stringify({id: userClientId})).then(function(userClient){
                    		selectedUserClient = userClient.data;
                    		return selectedUserClient;
                    	});
                	}
                },
                
                /**
                 * Getter of selectedUserClient
                 */
                getUserClient: function(){
                	return selectedUserClient;
                }
            };
        }])
;
