'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ViewProgramContentInclusionService resources
 */
    .service('ViewProgramContentInclusionService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
                                       
               /**
                 * Get ClientProgramContentInclusion by Client
                 */
                getClientProgramContentInclusion: function () {
                	console.log(Client);
                	
                    return $http.get(UriTemplate.create(Client.getClient().link.clientProgramContentInclusion).stringify())
                        .then(function (response) {
                        	CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                
                /*
                 * fetch the page for pagination
                 */
                fetchPageLink: function (href) {
                    return $http.get(href)
                        .then(function (response) {
                       	 CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });

                },
                             
              
                /**
                 * Finds Programs
                 *
                 * @param query the search query
                 * @param sort order
                 * @param pageSize how many per page
                 * @param specialty if the user chose one
                 * @returns {*}
                 */
                getProgramList: function (query, sort, pageSize, specialty) {
                    return $http.get(UriTemplate.create(Client.getClient().link.programContentList).stringify({
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                            size: pageSize,
                            s: specialty ? specialty.entity.id : '',
                            q: query
                        }
                    )).then(function (response) {
                    	return response.data;
                    });
                },

                                          
                /**
                 * Delete single ClientProgramContentInclusion
                 * 
                 */
                removeProgram: function(deleteProgramInclusion){
                	return $http.delete(UriTemplate.create(deleteProgramInclusion.link.self)
                			.stringify()).then();
                }
                };
                
       
}])
;
