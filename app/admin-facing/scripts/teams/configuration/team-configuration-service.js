'use strict';
angular.module('emmiManager')

    .service('ClientTeamConfigurationService', 
        function () {
    	  var team = '';   
    	  return {
    	    	  
    	        /**
                 * get the team for retrieve team configuration
                 */
    		     getTeam: function() {
    	            return team;
    	         },
    	         /**
    	          * set the team for team configuration
    	          */
    	         setTeam: function(teamResource) {
    	            team = teamResource;
    	         }
          };
    }
);