'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ContentSubscriptionConfiguration resources
 */
    .service('ContentSubscriptionConfigurationService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
                
                /**
                 * Call server to get a page of ContentSubscription list 
                 */
                getContentSubscriptionList: function () {
                    return $http.get(UriTemplate.create(Client.getClient().link.contentSubscriptions).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Get ContentSubscriptionConfiguration by Client
                 */
                getContentSubscriptionConfiguration: function () {
                    return $http.get(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify())
                        .then(function (response) {
                        	CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Return an empty ContentSubscriptionConfiguration
                 */
                createContentSubscriptionConfiguration: function () {
                    return {
                        entity: {
                            contentSubscription: {},
                            faithBased: false,
                         }
                    };
                },
                
                /**
                 * Delete single ContentSubscriptionConfigurationService
                 * 
                 */
                 deleteContent: function(deleteContentSubscription){
                	 return $http.delete(UriTemplate.create(deleteContentSubscription.link.self)
                			.stringify()).then();
                },
                
                /**
                 * Create ContentSubscriptionConfiguration for a Client
                 * @param contentSubscriptionConfiguration to create for a client
                 * 
                 */
                create: function(selectedContentSubscription){
                    return $http.post(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Update ContentSubscriptionConfiguration for a Client
                 * @param contentSubscriptionConfiguration to update for a client
                 * 
                 */
                update: function(selectedContentSubscription){
                   return $http.put(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }
            };
        }])
;
