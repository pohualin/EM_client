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
                            contentSubscription: {name:'None', id:0},
                            faithBased: false,
                            source: false,
                            sourceContentSubscription: null
                        }
                    };
                },
                
                /**
                 * Remove single ContentSubscriptionConfigurationService
                 * @param contentSubscriptionConfiguration to remove
                 * 
                 */
                remove: function(contentSubscriptionConfiguration){
                    return $http.delete(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations)
                            .stringify()).then();
                },
                
                /**
                 * Save contentSubscriptionConfiguration
                 */ 
                saveOrUpdate: function(selectedContentSubscription){
                    if(angular.isDefined(selectedContentSubscription.entity.id)){
                        return $http.put(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                                selectedContentSubscription.entity)
                            .then(function (response) {
                                CommonService.convertPageContentLinks(response.data);
                                return response.data;
                            });
                    }
                    else{
                        return $http.post(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                    }
                }
                
            
            };
        }])
;
