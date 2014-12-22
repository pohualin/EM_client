'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUser
 */
.controller('UsersClientUserClientTeamRolesSearchController', 
		['$scope', 'Client', 'CommonService', 'UserClientUserClientTeamRolesService',
        function ($scope, Client, CommonService, UserClientUserClientTeamRolesService) {
			
			/**
			 * Call this method to fetch next page
			 */
			$scope.fetchPage = function(url){
				$scope.loading = true;
				CommonService.fetchPage(url).then(function(response){
					CommonService.convertPageContentLinks(response);
					UserClientUserClientTeamRolesService.postProcess(response, $scope.selectedTeamRoles);
					$scope.handleResponse(response, 'userClientUserClientTeamRoles');
				});
			};
			
			/**
			 * Call when GO button is clicked
			 */
			$scope.search = function(isValid){
				$scope.searchPerformed = true;
				$scope.loading = true;
				UserClientUserClientTeamRolesService.findPossible($scope.teamQuery).then(function (userClientUserClientTeamRolePage) {
                    $scope.handleResponse(userClientUserClientTeamRolePage, 'userClientUserClientTeamRoles');
                    $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
			};
			
			function init(){
				$scope.selectedClientTeamRole = UserClientUserClientTeamRolesService.getSelectedClientTeamRole();
				UserClientUserClientTeamRolesService.findPossible().then(function (userClientUserClientTeamRolePage) {
                    if(userClientUserClientTeamRolePage && userClientUserClientTeamRolePage.page.totalElements > 0){
                    	$scope.hasTeams = true;
                    }
                });
			}
			
			init();
        }
    ])
;
