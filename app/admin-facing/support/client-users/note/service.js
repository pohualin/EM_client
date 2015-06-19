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
                            return self.newClientNote();
                        }
                        return response;
                    });
                },
                
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
                },

                /**
                 * Call server to fetch next batch of UserClient
                 */
                fetchPage: function (href) {
                    return $http.get(UriTemplate.create(href).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response);
                            return response.data;
                        });
                }
            };
        }]);
