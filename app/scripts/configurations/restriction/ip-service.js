'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for IpRestrictConfiguration resources
 */
    .service('IpRestrictConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService',
        function ($filter, $q, $http, UriTemplate, CommonService) {
            return {
                
                /**
                 * Call server to fetch next batch of IpRestrictConfiguration
                 */
                fetchPage: function (href) {
                    return $http.get(UriTemplate.create(href).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Get IpRestrictConfiguration by ClientRestrictConfiguration
                 */
                getIpRestrictConfiguration: function (clientRestrictConfiguration, sort) {
                    return $http.get(UriTemplate.create(clientRestrictConfiguration.link.ipRestrictConfiguration).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                    }))
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Remove single ipRestrictConfiguartion
                 * @param ipRestrictToRemove to remove
                 * 
                 */
                remove: function(ipRestrictToRemove){
                    return $http.delete(UriTemplate.create(ipRestrictToRemove.link.self)
                            .stringify()).then();
                },
                
                /**
                 * Save IpRestrictConfiguration
                 */ 
                save: function(clientRestrictConfiguration, ipRestrictConfiguration){
                    return $http.post(UriTemplate.create(clientRestrictConfiguration.link.ipRestrictConfiguration).stringify(), 
                            ipRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
                
            
            };
        }])
;
