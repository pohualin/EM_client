'use strict';
angular.module('emmiManager')

    .service('UserClientUserClientTeamRolesService', ['$q', '$http', 'UriTemplate', 'Client','CommonService', 'UsersClientService',
        function ($q, $http, UriTemplate, Client, CommonService, UsersClientService) {
    		var selectedClientTeamRole;
            return {
            	/**
            	 * Call server to save all selected Teams
            	 */
            	associateTeams: function(selectedTeamRoles){
            		var userClient = UsersClientService.getUserClient();
            		var userClientUserClientTeamRoles = [];

            		angular.forEach(selectedTeamRoles, function(selectedTeamRole){
            			if(selectedTeamRole.id){
            				selectedTeamRole.userClientTeamRole = selectedClientTeamRole.entity;
            				userClientUserClientTeamRoles.push(selectedTeamRole);
            			} else {
            				var userClientUserClientTeamRole = 
            					{team: selectedTeamRole.team, 
            					 userClientTeamRole: selectedClientTeamRole.entity, 
            					 userClient: userClient.entity};
                			userClientUserClientTeamRoles.push(userClientUserClientTeamRole);	
            			}
            		});
            		return $http.post(UriTemplate.create(userClient.link.possibleTeams).stringify(), userClientUserClientTeamRoles);
            	},
            	
            	/**
            	 * Check selected UserClientUserClientTeamRoles and see if confirmation modal is needed
            	 */
            	checkSelectedTeamRoles: function(selectedTeamRoles, clientTeamRoles){
            		var cards = {};
            		var cardsToRefresh = [];
            		var deferred = $q.defer();
            		angular.forEach(selectedTeamRoles, function(selectedTeamRole){
            			if(selectedTeamRole.warning){
            				if(!cards[selectedTeamRole.userClientTeamRole.id]){
            					angular.forEach(clientTeamRoles, function(clientTeamRole){
            						if(clientTeamRole.entity.id === selectedTeamRole.userClientTeamRole.id){
            							cards[selectedTeamRole.userClientTeamRole.id] = clientTeamRole;
            						}
            					});
            				}
            			}
            		});
            		angular.forEach(cards, function(cardToRefresh){
						cardsToRefresh.push(cardToRefresh);
					});
            		deferred.resolve(cardsToRefresh);
            		return deferred.promise;
            	},
            	
            	/**
            	 * Delete all UserClientUserClientTeamRole for selected clientTeamRole
            	 * 
            	 * @param clientTeamRole
            	 * @returns
            	 */
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
            	findPossible: function(query, tag, sort){
            		var external = this;
            		return $http.get(UriTemplate.create(UsersClientService.getUserClient().link.possibleTeams)
            		        .stringify({term: query,
            		            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
            		            tagId: tag ? tag.id : null}))
            			.then(function(response){
            			CommonService.convertPageContentLinks(response.data);
            			external.postProcess(response.data, []);
            			return response.data;
            		});
            	},
            	
            	/**
            	 * Post process UserClientUserClientTeamRoles
            	 * Check teams that are already selected.
            	 * Compose warning messages.
            	 */
            	postProcess: function(response, selectedTeamRoles){
            		angular.forEach(response.content, function(content){
        				var entity = content.entity;
        				if(entity.userClientTeamRole && entity.userClientTeamRole.id !== selectedClientTeamRole.entity.id){
        					entity.warning = 'This user is an ' + entity.userClientTeamRole.name + ' at this team.';
        				}
        				content.entity.selected = 
		            		selectedTeamRoles[content.entity.team.id] ? true : false;
        			});
            	},
            	
            	/**
            	 * Refresh single team role card
            	 */
            	refreshTeamRoleCard: function(clientTeamRole){
            		var userClient = UsersClientService.getUserClient();
            		return $http.get(UriTemplate.create(userClient.link.existingTeams).stringify({userClientTeamRoleId: clientTeamRole.entity.id}))
	            		.then(function(response){
	            			CommonService.convertPageContentLinks(response.data);
	            			clientTeamRole.existingTeams = response.data.content;
	            		});
            	},
            	
            	/**
            	 * Refresh all team role cards
            	 */
            	refreshTeamRoleCards: function(clientTeamRoles){
            		var userClient = UsersClientService.getUserClient();
            		var external = this;
            		angular.forEach(clientTeamRoles, function(clientTeamRole){
            			external.refreshTeamRoleCard(clientTeamRole);
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
            	}
            };
        }])
;
