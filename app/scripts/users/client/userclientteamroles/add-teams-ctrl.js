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
			 * Place to hold selected team from search results
			 */
			$scope.selectedTeams = {};
			
			/**
			 * Call when "add teams" link clicked
			 * clientTeamRole passed in as parameter
			 * 
			 */
			$scope.addTeams = function(clientTeamRole){
				UserClientUserClientTeamRolesService.setSelectedClientTeamRole(clientTeamRole);
				addTeamsModal.$promise.then(addTeamsModal.show);
			};
			
			/**
    		 * Call this method when checkbox is checked/unchecked
    		 */
    		$scope.onCheckboxChange = function (team) {
                if (team.selected) {
                    $scope.selectedTeams[team.id] = angular.copy(team);
                } else {
                    delete $scope.selectedTeams[team.id];
                }
            };
	
            /**
             * Call this method when save is clicked
             */
            $scope.save = function(){
            	window.paul = $scope.selectedTeams;
            	UserClientUserClientTeamRolesService.associateTeams($scope.selectedTeams).then(function(response){
            		console.log('back');
            	});
            };
        }
    ])
;
