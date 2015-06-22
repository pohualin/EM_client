'use strict';
angular.module('emmiManager')

/**
 * This service is responsible fetch operations for UserClient resources across clients
 */
    .service('ClientNoteService', ['$q', '$http', 'UriTemplate', 'CommonService',
        function ($q, $http, UriTemplate, CommonService) {
            return {
                /**
                 * Create a ClientNote placeholder
                 */
                newClientNote: function(client){
                    return {entity:{client: client, note:''}};
                },
                
                /**
                 * Call server to get client note for the client
                 */
                getClientNote: function (client) {
                    var self = this;
                    return $http.get(UriTemplate.create(client.link.clientNote).stringify()).then(function (response) {
                        if(response.status === 204){
                            // No ClientNote for this Client
                            return self.newClientNote(client);
                        }
                        return response.data;
                    });
                },
                
                /**
                 * Create a ClientNote
                 */
                createClientNote: function(client, clientNote){
                    return $http.post(UriTemplate.create(client.link.clientNote).stringify(), clientNote.entity)
                        .then(function(response){
                            return response.data;
                        });
                },
                
                /**
                 * Update existing ClientNote
                 */
                updateClientNote: function(client, clientNote){
                    return $http.put(UriTemplate.create(clientNote.link.self).stringify(), clientNote.entity)
                        .then(function(response){
                            return response.data;
                        });
                }
            };
        }]);
