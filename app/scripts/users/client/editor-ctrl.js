'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService',
        function ($alert, $location, $scope, Client, UsersClientService) {

            $scope.client = Client.getClient();
            $scope.selectedUserClient = UsersClientService.getUserClient();
            $scope.page.setTitle('View User - ' + $scope.client.entity.name);

	    	/**
	         * Called when 'Create Another User' is clicked
	         */
	        $scope.createAnotherUserClient = function () {
	        	$location.path('/clients/' + $scope.client.entity.id + '/users/new');
	        };

            /**
             * Called if the user confirms they want to navigate away from the page when clicking the clink link-back
             */
            $scope.confirmExit = function() {
                $location.path('/clients/'+$scope.client.entity.id);
            };

        }
    ])
;
