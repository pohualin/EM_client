'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for EmailRestrictConfiguration resources
 */
    .service('ProfileEmailRestrictConfigurationsService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Session',
        function ($filter, $q, $http, UriTemplate, CommonService, Session) {
            return {
            	 /**
                 * Get EmailRestrictConfiguration by Client
                 */
                getEmailRestrictConfiguration: function () {
                	return $http.get(UriTemplate.create(Session.clientResource.link.emailRestrictConfigurations).stringify({
                    	page: null,
                    	size: null,
                    	sort: null
                    }))
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
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
