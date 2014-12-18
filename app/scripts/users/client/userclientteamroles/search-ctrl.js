'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUser
 */
.controller('UsersClientUserClientTeamRolesSearchController', 
		['$scope', 'Client', 'UserClientUserClientTeamRolesService',
        function ($scope, Client, UserClientUserClientTeamRolesService) {
			
			/**
			 * Call when GO button is clicked
			 */
			$scope.search = function(isValid){
				$scope.searchPerformed = true;
				$scope.loading = true;
				UserClientUserClientTeamRolesService.findPossible($scope.query).then(function (userClientUserClientTeamRolePage) {
                    $scope.handleResponse(userClientUserClientTeamRolePage, 'userClientUserClientTeamRoles');
                    $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
			};
			
			function init(){
				$scope.selectedClientTeamRole = UserClientUserClientTeamRolesService.getSelectedClientTeamRole();
			}
			
			init();
        }
    ])
;
