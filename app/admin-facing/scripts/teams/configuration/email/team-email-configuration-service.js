'use strict';
angular.module('emmiManager')

    .service('ClientTeamEmailConfigurationService', ['$q', '$http', 'UriTemplate', 
              function ($q, $http, UriTemplate) {
    	      return {
    	    	  
    	    	 /**
                 * Calls the back end to get all email configuration for a client-team
                 *
                 * @param teamResource
                 * @returns all questions and responses for a client user
                 */
                getTeamEmailConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.teamEmailConfig).stringify())
                        .then(function (response) {
                        	return response.data.content;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client-team email configuration.
                 * @param team
                 * @param emailConfigs all the email configuration for a team 
                 * @returns {*} the promise
                 */
                saveOrUpdateTeamEmailConfiguration: function (team,
                		                                      emailConfigs){
                	
                	// looping thru the email configs and save them
                	var deferred = $q.defer();
                	var promises = [];
                    var updatedEmailConfigurations = [];
                    angular.forEach(emailConfigs, function (emailConfig) {
                    	var deferred = $q.defer();
                    	$http.post(UriTemplate.create(team.link.teamEmailConfig)
                                .stringify(), emailConfig.entity).then(function(response){
                                	updatedEmailConfigurations.push(response.data);
                                	deferred.resolve(response);
                                });
                    	promises.push(deferred.promise);
                    });
                    
                    $q.all(promises).then(function () {
                    	deferred.resolve(updatedEmailConfigurations);
                    });
                    
                   return deferred.promise;
                }
    	       };

       
    }
])
;