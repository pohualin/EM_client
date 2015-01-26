'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for EmailRestrictConfiguration resources
 */
    .service('EmailRestrictConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService',
        function ($filter, $q, $http, UriTemplate, CommonService) {
            return {
                
                /**
                 * Call server to fetch next batch of EmailRestrictConfiguration
                 */
                fetchPage: function (href) {
                    return $http.get(UriTemplate.create(href).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Get EmailRestrictConfiguration by ClientRestrictConfiguration
                 */
                getEmailRestrictConfiguration: function (clientRestrictConfiguration, sort) {
                    return $http.get(UriTemplate.create(clientRestrictConfiguration.link.emailRestrictConfiguration).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                    }))
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Remove single emailRestrictConfiguartion
                 * @param emailRestrictToRemove to remove
                 * 
                 */
                remove: function(emailRestrictToRemove){
                    return $http.delete(UriTemplate.create(emailRestrictToRemove.link.self)
                            .stringify()).then();
                },
                
                /**
                 * Save EmailRestrictConfiguration
                 */ 
                save: function(clientRestrictConfiguration, emailRestrictConfiguration){
                    return $http.post(UriTemplate.create(clientRestrictConfiguration.link.emailRestrictConfiguration).stringify(), 
                            emailRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
                
            
            };
        }])
;
