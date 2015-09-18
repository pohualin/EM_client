'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for program contentSubscription configuration resources
 */
    .service('MainContentService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
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
                
             };
        }])
;
