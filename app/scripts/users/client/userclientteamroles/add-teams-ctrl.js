'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUser
 */
.controller('UsersClientUserClientTeamRolesAddTeamsController', 
		['$modal', '$scope', 'UserClientUserClientTeamRolesService',
        function ($modal, $scope, UserClientUserClientTeamRolesService) {
			
			var addTeamsModal = $modal(
					{scope: $scope, 
					 template: 'partials/user/client/userclientteamrole/search.html', 
					 animation: 'none', 
					 backdropAnimation: 'emmi-fade', 
					 show: false, backdrop: 'static'});
			
			/**
			 * Call when "add teams" link clicked
			 * clientTeamRole passed in as parameter
			 */
			$scope.addTeams = function(clientTeamRole){
				UserClientUserClientTeamRolesService.setSelectedClientTeamRole(clientTeamRole);
				$scope.searchPerformed = false;
				$scope.selectedTeamRoles = {};
				addTeamsModal.$promise.then(addTeamsModal.show);
			};
			
			/**
			 * Call when cancel button is clicked
			 */
			$scope.cancel = function(){
				$scope.hideAddTeamsModal();
			};
			
			/**
			 * Check if warning is needed
			 */
			$scope.checkSelectedTeamRoles = function(){
				if(UserClientUserClientTeamRolesService.checkSelectedTeamRoles($scope.selectedTeamRoles)){
					$scope.needComfirmationModal = true;
				} else {
					$scope.needComfirmationModal = false;
				}
			};
			
			/**
			 * Hide addTeamsModal
			 */
			$scope.hideAddTeamsModal = function () {
				addTeamsModal.hide();
	        };
			
			/**
    		 * Call this method when checkbox is checked/unchecked
    		 */
    		$scope.onCheckboxChange = function (userClientTeamRole) {
                if (userClientTeamRole.selected) {
                    $scope.selectedTeamRoles[userClientTeamRole.team.id] = angular.copy(userClientTeamRole);
                } else {
                    delete $scope.selectedTeamRoles[userClientTeamRole.team.id];
                }
            };
	
            /**
             * Call this method when save is clicked
             */
            $scope.save = function(){
            	UserClientUserClientTeamRolesService.associateTeams($scope.selectedTeamRoles).then(function(response){
            		$scope.hideAddTeamsModal();
            		$scope.setHasMoreTeamRole();
            	});
            };
        }
    ])
;
