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
                }
            };
        }])
;
