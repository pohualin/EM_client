'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService',
        function ($alert, $location, $scope, Client, UsersClientService) {

	    	/**
	         * Called when 'Create Another User' is clicked
	         */
	        $scope.createAnotherUserClient = function () {
	        	$location.path('/clients/' + $scope.client.entity.id + '/users/new');
	        };
    	
    		
    		/**
	         * init method called when the page is loading
	         */
            function init(){
            	$scope.client = Client.getClient();
        		$scope.selectedUserClient = UsersClientService.getUserClient();
        		$scope.page.setTitle('View User - ' + $scope.client.entity.name);
            }

            init();
        }
    ])
;
