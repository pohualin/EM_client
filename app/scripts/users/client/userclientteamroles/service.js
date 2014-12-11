'use strict';
angular.module('emmiManager')

    .service('UserClientUserClientTeamRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
            	/*
            	 * Associate selected UserClientTeamRole to selected UserClient
            	 */
                associateUserClientUserClientTeamRole: function(userClient, selectedUserClientTeamRole){
                	var userClientUserClientTeamRole = new Object({});
                	userClientUserClientTeamRole.userClient = userClient.entity;
                	userClientUserClientTeamRole.userClientTeamRole = new Object({id: selectedUserClientTeamRole});
                	return $http.post(UriTemplate.create(userClient.link.userClientTeamRoles).stringify(), userClientUserClientTeamRole)
	                    .success(function(response) {
	                        return response;
	                    });
                },
            	
            	/*
            	 * To remove UserClientUserClientTeamRole
            	 */
            	deleteUserClientUserClientTeamRole: function(existingUserClientUserClientTeamRole){
            		return $http.delete(UriTemplate.create(existingUserClientUserClientTeamRole.link.userClientUserClientTeamRole)
            				.stringify({userClientUserClientTeamRoleId: existingUserClientUserClientTeamRole.entity.id})).then(function(response){
            				});
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
            	},
            	
            	loadPermissionsForExistingUserClientUserClientTeamRole: function(existingUserClientUserClientTeamRole){
            		if(!existingUserClientUserClientTeamRole.entity.permissions){
            			$http.get(UriTemplate.create(existingUserClientUserClientTeamRole.link.userClientTeamRolePermissions).stringify()).then(function(permissions){
            				existingUserClientUserClientTeamRole.entity.permissions = permissions.data;
                    	});
            		}
            	}
            };
        }])
;
