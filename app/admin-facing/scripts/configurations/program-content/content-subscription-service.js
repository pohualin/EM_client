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
                 * Create/save ContentSubscriptionConfiguration
                 * @param contentSubscriptionConfiguration to save
                 * 
                 */
                save: function(selectedContentSubscription){
                    return $http.post(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Update single ContentSubscriptionConfiguration
                 * @param contentSubscriptionConfiguration to update
                 * 
                 */
                update: function(selectedContentSubscription){
                    return $http.put(UriTemplate.create(Client.getClient().link.clientContentSubscriptionConfigurations).stringify(), 
                            selectedContentSubscription.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * save or Update contentSubscriptionConfiguration
                 */ 
                saveOrUpdate: function(selectedContentSubscription){
                    var deferred = $q.defer();
                    if(angular.isDefined(selectedContentSubscription.entity.id)){
                        this.update(selectedContentSubscription).then(function(response){
                            deferred.resolve(response);
                        });
                    } else {
                        this.save(selectedContentSubscription).then(function(response){
                            deferred.resolve(response);
                        });
                    }
                    return deferred.promise;
                }
 
            };
        }])
;
