'use strict';

angular.module('emmiManager')
    .controller('ProfileEditNameCtrl', ['$scope', '$controller', '$alert', 'ProfileService',
        function ($scope, $controller, $alert, ProfileService) {

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
            $scope.whenSaving = true;
			ProfileService.update(userClient).then(function(response){
				angular.extend($scope.userClient, response);
            }).finally(function () {
                $scope.whenSaving = false;
            });
		} else {
            // $scope.formValidationError();
		}
	};

        }])
;
