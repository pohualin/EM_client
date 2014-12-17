'use strict';
angular.module('emmiManager')

    .service('UserClientUserClientTeamRolesService', ['$q', '$http', 'UriTemplate', 'Client','CommonService', 'UsersClientService',
        function ($q, $http, UriTemplate, Client, CommonService, UsersClientService) {
    		var selectedClientTeamRole;
            return {
            	/**
            	 * Call server to save all selected Teams
            	 */
            	associateTeams: function(selectedTeams){
            		var userClient = UsersClientService.getUserClient();
            		var userClientUserClientTeamRoles = [];
            		angular.forEach(selectedTeams, function(selectedTeam){
            			var userClientUserClientTeamRole = {team: selectedTeam, userClientTeamRole: selectedClientTeamRole.entity, userClient: userClient.entity};
            			userClientUserClientTeamRoles.push(userClientUserClientTeamRole);
            		});
            		return $http.post(UriTemplate.create(userClient.link.possibleTeams).stringify(), userClientUserClientTeamRoles).then(function(response){
            			return response;
            		});
            	},
            	
            	deleteAllUserClientUserClientTeamRole: function(clientTeamRole){
            		return $http.delete(UriTemplate.create(UsersClientService.getUserClient().link.existingTeams)
            				.stringify({userClientTeamRoleId: clientTeamRole.entity.id}));
            	},
            	
            	/**
            	 * Delete existing UserClientUserClientTeamRole
            	 */
            	deleteUserClientUserClientTeamRole: function(existing){
            		return $http.delete(UriTemplate.create(existing.link.self).stringify({userClientUserClientTeamRoleId: existing.entity.id}));
            	},
            	
            	/**
            	 * Find all possible UserClientUserClientTeamRoles by clientId and term
            	 */
            	findPossible: function(query){
            		return $http.get(UriTemplate.create(UsersClientService.getUserClient().link.possibleTeams).stringify({term: query}))
            			.then(function(response){
            			CommonService.convertPageContentLinks(response.data);
            			return response.data;
            		});
            	},
            	
            	getExistingTeams: function(clientTeamRole){
            		var userClient = UsersClientService.getUserClient();
            		return $http.get(UriTemplate.create(userClient.link.existingTeams).stringify({userClientTeamRoleId: clientTeamRole.entity.id}))
	            		.then(function(response){
	            			CommonService.convertPageContentLinks(response.data);
	            			clientTeamRole.existingTeams = response.data.content;
	            			return response.data;
	            		});
            	},
            	
            	/**
            	 * Set selectedClientTeamRole when user click on add team from selected UserClientTeamRole card
            	 */
            	setSelectedClientTeamRole: function(clientTeamRole){
            		selectedClientTeamRole = clientTeamRole;
            	},
            	
            	/**
            	 * Return the selectedClientTeamRole
            	 */
            	getSelectedClientTeamRole: function(){
            		return selectedClientTeamRole;
            	},
            	
            	/**
            	 * @Unused
            	 * TODO
            	 */
            	disableClientTeamRoles: function(clientTeamRoles){
            		angular.forEach(clientTeamRoles, function (clientTeamRole) {
                        clientTeamRole.disabled = true;
                    });
            		clientTeamRoles[0].disabled = false;
            	},
            	
            	/*
            	 * Get existing UserClientUserClientTeamRole relationship
            	 */
            	getUserClientUserClientTeamRoles: function(userClient){
                	return $http.get(UriTemplate.create(userClient.link.userClientTeamRoles).stringify())
                    .success(function(page) {
                    	CommonService.convertPageContentLinks(page);
                        return page;
                    });
            	}
            };
        }])
;
