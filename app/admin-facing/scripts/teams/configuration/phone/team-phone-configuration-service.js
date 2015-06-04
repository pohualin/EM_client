'use strict';
angular.module('emmiManager')

    .service('ClientTeamPhoneConfigurationService', ['$q', '$http', 'UriTemplate',
        function ($q, $http, UriTemplate) {
    	      return {
    	    	  
    	    	 /**
                 * Calls the back end to get all phone configuration for a client-team
                 *
                 * @param teamResource
                 * @returns all questions and responses for a client user
                 */
                getTeamPhoneConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.teamPhoneConfig).stringify())
                        .then(function (response) {
                        	return response.data.content;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client-team phone configuration.
                 * @param team
                 * @param phoneConfigs all the phone configuration for a team 
                 * @returns {*} the promise
                 */
                saveOrUpdateTeamPhoneConfiguration: function (team,
                		                                      phoneConfigs){
                	
                	// looping thru the phone configs and save them
                	var deferred = $q.defer();
                	var promises = [];
                    var updatedPhoneConfigurations = [];
                    angular.forEach(phoneConfigs, function (phoneConfig) {
                    	var deferred = $q.defer();
                    	$http.post(UriTemplate.create(team.link.teamPhoneConfig)
                                .stringify(), phoneConfig.entity).then(function(response){
                                	updatedPhoneConfigurations.push(response.data);
                                	deferred.resolve(response);
                                });
                    	promises.push(deferred.promise);
                    });
                    
                    $q.all(promises).then(function () {
                    	deferred.resolve(updatedPhoneConfigurations);
                    });
                    
                   return deferred.promise;
                }
    	       };

                  
         
    }
])
;