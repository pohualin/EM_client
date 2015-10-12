'use strict';
angular.module('emmiManager')

/**
 * This service is responsible CRUD operations for ProgramContentInclusion resources
 */
    .service('ProgramContentInclusionService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
                /**
                 * Loads all possible program specialties
                 *
                 * @returns {*}
                 */
                getSpecialtiesList: function () {
                    var specialties = [];
                    return $http.get(UriTemplate.create(Client.getClient().link.specialtiesList).stringify())
                        .then(function success(response) {
                            var page = response.data;
                            specialties.push.apply(specialties, page.content);
                            if (page.link && page.link['page-next']) {
                                return $http.get(page.link['page-next']).then(function (response) {
                                    return success(response);
                                });
                            }
                            return specialties;
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
                 * Fetches the next page of programs
                 *
                 * @param href to use
                 * @returns {*}
                 */
                fetchProgramPage: function (href) {
                    return $http.get(href)
                        .then(function (response) {
                            return response.data;
                        });

                },

                
                /**
                 * Create ClientProgramContentInclusion for a Client
                 * @param clientProgramContentInclusion to create for a client
                 * 
                 */
                create: function(selectedProgramInclusion){
                	return $http.post(UriTemplate.create(Client.getClient().link.clientProgramContentInclusion).stringify(), 
                            selectedProgramInclusion.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                
                /**
                 * Update ClientProgramContentInclusion for a Client
                 * @param clientProgramContentInclusion to update for a client
                 * 
                 */
                update: function(updateProgramInclusion){
                    return $http.put(UriTemplate.create(updateProgramInclusion.link.self).stringify(), 
                            updateProgramInclusion.entity, {override500: true})
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                }, 
                
                /**
                 * Compose programSaveRequest for save calls
                 */
                createSaveRequest: function(selectedPrograms) {
                    var saveRequest = [];
                    angular.forEach(selectedPrograms, function(program){
                       var request = {entity: {
                           program: {}}};
                       request.entity.program = program;
                       saveRequest.push(request);
                    });
                    return saveRequest;
                },
               
                
                /**
                 * Save one or more selected program content inclusion
                 * 
                 * @param programInclusionList to create
                 * @returns {*} a promise
                 */
                saveAll: function (programList) {
                	var self = this;
                    var deferred = $q.defer();
                    var saveRequests = [];
                    angular.forEach(programList, function (aProgramContent){
                    	var deferred = $q.defer();
                    	    if((aProgramContent.entity.program !== null) &&
                    				(angular.isDefined(aProgramContent.entity.program.id))){
                    			self.create(aProgramContent).then(function(response){
                    				deferred.resolve(response);
                    	    });
                    	    }
                       		saveRequests.push(deferred.promise);
              		});
                     $q.all(saveRequests).then(function(response){
                        deferred.resolve(response);
                    });
                    return deferred.promise;
}
                
            };
                
}])
;
