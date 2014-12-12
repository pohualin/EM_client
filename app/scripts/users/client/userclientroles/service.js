'use strict';
angular.module('emmiManager')

    .service('UserClientUserClientRolesService', ['$q', '$http', 'UriTemplate', 'CommonService', 'Client',
        function ($q, $http, UriTemplate, CommonService, Client) {
            return {
            	/**
            	 * Associate selected UserClientRole to selected UserClient
            	 */
                associateUserClientUserClientRole: function(userClient, selectedUserClientRole){
                	var userClientUserClientRole = {};
                	userClientUserClientRole.userClient = userClient.entity;
                	userClientUserClientRole.userClientRole = {id: selectedUserClientRole};
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
            		var deferred = $q.defer();
                    var userClientUserClientRoles = [];
                    $http.get(UriTemplate.create(userClient.link.userClientRoles).stringify())
                        .then(function load(response) {
                            var page = response.data;
                            CommonService.convertPageContentLinks(page);
                            angular.forEach(page.content, function (content) {
                            	userClientUserClientRoles.push(content);
                            });
                            if (page.link && page.link['page-next']) {
                                $http.get(page.link['page-next']).then(function (response) {
                                    load(response);
                                });
                            }
                            deferred.resolve(userClientUserClientRoles);
                        });
                    return deferred.promise;
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
