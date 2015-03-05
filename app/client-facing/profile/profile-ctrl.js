'use strict';

angular.module('emmiManager')
	.controller('ProfileCtrl', ['$scope', 'userClientReqdResource', 'API', 'ProfileService', function($scope, userClientReqdResource, api, ProfileService){
		
	$scope.editMode = false;
	$scope.userClient  = userClientReqdResource;

	$scope.edit = function () {
		$scope.editMode = true;
	};
	
	$scope.cancel = function () {
		$scope.editMode = false;
		ProfileService.get(userClientReqdResource).then(function(response){
			angular.extend($scope.userClient, response);
		});
	}
	
	$scope.saveProfileUpdates = function (uC, isValid) {
		$scope.formSubmitted = true;
		if(isValid){
			$scope.editMode = false;
			ProfileService.update(uC).then(function(response){
				angular.extend($scope.userClient, response);
			});
		}
	}
}])
;