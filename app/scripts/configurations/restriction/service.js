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
                 * Save ClientRestrictConfiguration
                 */ 
                save: function(clientRestrictConfiguration){
                    return $http.put(UriTemplate.create(clientRestrictConfiguration.link.self).stringify(), clientRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
            
            };
        }])
;
