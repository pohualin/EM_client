'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for IpRestrictConfiguration resources
 */
    .service('IpRestrictConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
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
                 * Get IpRestrictConfiguration by Client
                 */
                getIpRestrictConfiguration: function (sort) {
                    return $http.get(UriTemplate.create(Client.getClient().link.ipRestrictConfigurations).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                    }))
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Return an empty IpRestrictConfiguration
                 */
                newIpRestrictConfiguration: function(){
                    return {};
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
                save: function(ipRestrictConfiguration){
                    return $http.post(UriTemplate.create(Client.getClient().link.ipRestrictConfigurations).stringify(), 
                            ipRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
                
            
            };
        }])
;
