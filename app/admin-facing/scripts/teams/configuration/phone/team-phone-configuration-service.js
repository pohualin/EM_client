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
                        	return response.data;
                        });
                },
                
                /**
                 * Calls the back end to save or update a client-team phone configuration.
                 * @param team
                 * @param phoneConfigs all the phone configuration for a team 
                 * @returns teamPhoneConfig
                 */
                saveOrUpdateTeamPhoneConfiguration: function (team,
                		                                      phoneConfigs){
                	return $http.post(UriTemplate.create(team.link.teamPhoneConfig).stringify(), phoneConfigs.entity)
                    .then(function (response) {
                    	return response.data;
                    });
                }
              };
          }
      ])
  ;