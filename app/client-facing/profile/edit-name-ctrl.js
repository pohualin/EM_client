'use strict';

angular.module('emmiManager')
	.controller('ProfileEditNameCtrl', ['$scope', '$controller', '$alert', 'ProfileService', 'ValidationService',
        function($scope, $controller, $alert, ProfileService, ValidationService){

	$scope.edit = function () {
		$scope.setEditMode(true);
	};

	$scope.cancel = function () {
		$scope.setEditMode(false);
		$scope.formSubmitted = false;
		$scope.hideErrorAlert();
		ProfileService.get($scope.userClient).then(function(response){
			angular.extend($scope.userClient, response);
		});
	};

	$scope.saveProfileUpdates = function (userClient, isValid) {
		$scope.formSubmitted = true;
		if(isValid){
		    $scope.setEditMode(false);
			ProfileService.update(userClient).then(function(response){
				angular.extend($scope.userClient, response);
			});
		} else {
            // $scope.formValidationError();
		}
	};
	
}])
;
