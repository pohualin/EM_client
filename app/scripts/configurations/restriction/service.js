'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ClientRestrictConfiguration resources
 */
    .service('ClientRestrictConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Client, Session) {
            return {
                
                /**
                 * Get ClientRestrictConfiguration by Client
                 */
                getClientRestrictConfiguration: function () {
                    return $http.get(UriTemplate.create(Client.getClient().link.restrictConfiguration).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Save a new ClientRestrictConfiuration
                 */
                save: function(clientRestrictConfiguration){
                    return $http.post(UriTemplate.create(Client.getClient().link.restrictConfiguration).stringify(), clientRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Call save if clientRestrictConfigurationId is null or update if clientRestrictConfigurationId is not null
                 */ 
                saveOrUpdate: function(clientRestrictConfiguration){
                    var deferred = $q.defer();
                    if(clientRestrictConfiguration.link.self){
                        this.update(clientRestrictConfiguration).then(function(response){
                            deferred.resolve(response);
                        });
                    } else {
                        this.save(clientRestrictConfiguration).then(function(response){
                            deferred.resolve(response);
                        });
                    }
                    return deferred.promise;
                },
                
                /**
                 * Update an existing ClientRestrictConfiguration
                 */
                update: function(clientRestrictConfiguration){
                    return $http.put(UriTemplate.create(clientRestrictConfiguration.link.self).stringify(), clientRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
            
            };
        }])
;
