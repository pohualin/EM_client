'use strict';
angular.module('emmiManager')

    .service('UserClientUserClientRolesService', ['$filter', '$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($filter, $q, $http, UriTemplate, CommonService, Client) {
            return {
            	/**
            	 * Associate selected UserClientRole to selected UserClient
            	 */
                associateUserClientUserClientRole: function(userClient, selectedUserClientRole){
                	var userClientUserClientRole = new Object({});
                	userClientUserClientRole.userClient = userClient.entity;
                	userClientUserClientRole.userClientRole = new Object({id: selectedUserClientRole});
                	return $http.post(UriTemplate.create(userClient.link.userClientRoles).stringify(), userClientUserClientRole)
	                    .success(function(response) {
	                        return response;
	                    });
                },
            	
                /**
            	 * To remove UserClientUserClientRole
            	 */
            	deleteUserClientUserClientRole: function(existingUserClientUserClientRole){
            		return $http.delete(UriTemplate.create(existingUserClientUserClientRole.link.userClientUserClientRole)
            				.stringify({userClientUserClientRoleId: existingUserClientUserClientRole.entity.id})).then(function(response){
            				});
            	},
            	
            	/**
            	 * Get existing UserClientUserClientRoles relationship
            	 */
            	getUserClientUserClientRoles: function(userClient){
                	return $http.get(UriTemplate.create(userClient.link.userClientRoles).stringify())
                    .success(function(page) {
                    	CommonService.convertPageContentLinks(page);
                        return page;
                    });
            	},
            	
            	/**
            	 * To load permissions for an existing UserClientRole
            	 */
            	loadPermissionsForExistingUserClientUserClientRole: function(existingUserClientUserClientRole){
            		if(!existingUserClientUserClientRole.entity.permissions){
            			$http.get(UriTemplate.create(existingUserClientUserClientRole.link.userClientRolePermissions).stringify()).then(function(permissions){
            				existingUserClientUserClientRole.entity.permissions = permissions.data;
                    	});
            		}
            	}
            };
        }])
;
