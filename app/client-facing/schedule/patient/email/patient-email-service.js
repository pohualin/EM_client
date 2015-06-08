'use strict';
angular.module('emmiManager')

    .service('PatientEmailService', ['$q', '$http', 'UriTemplate', 
        function ($q, $http, UriTemplate) {
    	      return {
    	    	  
    	    	 /**
                 * Calls the back end to get all email configuration for a client-team
                 *
                 * @param teamResource
                 * @returns email configurations for a client team
                 */
                getTeamEmailConfiguration: function (teamResource) {
                	   return $http.get(UriTemplate.create(teamResource.link.patientTeamEmailConfig).stringify())
                        .then(function (response) {
                           	return response.data.content;
                        });
                }
   	       };
    }
])
;