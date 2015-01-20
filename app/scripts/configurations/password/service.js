'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ClientPasswordConfiguration resources
 */
    .service('ClientPasswordConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Client, Session) {
            return {
                
                /**
                 * delete ClientPasswordConfiguration
                 * 
                 * @param clientPasswordConfiguration to delete
                 * @returns a default ClientPasswordConfiguration
                 */
                remove: function(clientPasswordConfiguration){
                    return $http.delete(UriTemplate.create(clientPasswordConfiguration.link.self).stringify({id: clientPasswordConfiguration.id}))
                        .then(function(response){
                            return response;
                        });
                },
                
                /**
                 * Get ClientPasswordConfiguration by Client
                 */
                getClientPasswordConfiguration: function () {
                    return $http.get(UriTemplate.create(Client.getClient().link.passwordConfiguration).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Save ClientPasswordConfiguration
                 */
                save: function(clientPasswordConfiguration){
                    return $http.put(UriTemplate.create(Client.getClient().link.passwordConfiguration).stringify(), clientPasswordConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
            
            };
        }])
;
