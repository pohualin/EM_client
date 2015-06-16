'use strict';
angular.module('emmiManager')

    .service('PatientPhoneService', ['$q', '$http', 'UriTemplate', 
        function ($q, $http, UriTemplate) {
    	      return {
    	    	  
    	    	 /**
                 * Calls the back end to get all phone configuration for a client-team
                 *
                 * @param teamResource
                 * @returns phone configurations for a client team
                 */
                getTeamPhoneConfiguration: function (teamResource) {
                	   return $http.get(UriTemplate.create(teamResource.link.patientTeamPhoneConfig).stringify())
                        .then(function (response) {
                        	return response.data.entity;
                        });
                }
   	       };
    }
])
;