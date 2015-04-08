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
                 * Get EmailRestrictConfiguration by Client
                 */
                /*
                getEmailRestrictConfiguration: function (sort) {
                    return $http.get(UriTemplate.create(Client.getClient().link.emailRestrictConfigurations).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : ''
                    }))
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                */
                
                /**
                 * Return an empty EmailRestrictConfiguration
                 */
                newEmailRestrictConfiguration: function(){
                    return {};
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
                /*
                save: function(emailRestrictConfiguration){
                    return $http.post(UriTemplate.create(Client.getClient().link.emailRestrictConfigurations).stringify(), 
                            emailRestrictConfiguration.entity)
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                */
                
                /**
                 * Return an array of valid email endings
                 */
                allValidEmailEndings: function(){
                    var responseArray = [];
                    return this.getEmailRestrictConfiguration()
                        .then(function addToResponseArray(response) {
                            angular.forEach(response.content, function (validEmailEnding) {
                                responseArray.push(validEmailEnding.entity.emailEnding);
                            });
                            if (response.link && response.link['page-next']) {
                                $http.get(response.link['page-next']).then(function (response) {
                                    addToResponseArray(response);
                                });
                            }
                            return responseArray;
                        });
                }
                
            
            };
        }])
;
