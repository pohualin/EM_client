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
                newClientNote: function(){
                    return {entity:{note:''}};
                },
                
                /**
                 * Call server to get client note for the client
                 */
                getClientNote: function (client) {
                    var self = this;
                    return $http.get(UriTemplate.create(client.link.clientNote).stringify()).then(function (response) {
                        if(response.status === 204){
                            // No ClientNote for this Client
                            return self.newClientNote();
                        }
                        return response;
                    });
                },
                
                /**
                 * Call create if ClientNote has no id, otherwise call update
                 */
                createOrUpdateClientNote: function(client, clientNote){
                    var deferred = $q.defer();
                    if (clientNote.entity.id){
                        this.updateClientNote(client, clientNote).then(function(response){
                            deferred.resolve(response);
                        });
                    } else {
                        this.createClientNote(client, clientNote).then(function(response){
                            deferred.resolve(response);
                        });
                    }
                    return deferred.promise;
                },
                
                /**
                 * Create a ClientNote
                 */
                createClientNote: function(client, clientNote){
                    return $http.post(UriTemplate.create(client.link.clientNote).stringify(), clientNote.entity)
                        .success(function(response){
                            return response;
                        });
                },
                
                /**
                 * Update existing ClientNote
                 */
                updateClientNote: function(client, clientNote){
                    return $http.put(UriTemplate.create(client.link.clientNote).stringify(), clientNote.entity)
                        .success(function(response){
                            return response;
                        });
                }
            };
        }]);
