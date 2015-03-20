'use strict';

angular.module('emmiManager')
	.controller('ProfileCtrl', ['$scope', 'userClientReqdResource', 'API', 'ProfileService', '$alert', 'ValidationService', '$modal',
        function($scope, userClientReqdResource, api, ProfileService, $alert, ValidationService, $modal){

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
	};

	$scope.saveProfileUpdates = function (uC, isValid) {
		$scope.formSubmitted = true;
		if(isValid){
			$scope.editMode = false;
			ProfileService.update(uC).then(function(response){
				angular.extend($scope.userClient, response);
			});
		}
	};

    $scope.editEmail = function () {
        $scope.emailEditMode = true;
        $scope.promptPasswordModal = {};
        $scope.promptPasswordModal = $modal({scope: $scope, template: 'client-facing/profile/passwordPrompt.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
    };

    $scope.verifyPassword = function (password){
        ProfileService.verifyPassword($scope.userClient, password).then(function success(response){
            $scope.editEmailFormSubmitted = false;
            $scope.passwordIsValidated = true;
            $scope.promptPasswordModal.hide();
        }, function fail(error){
            $scope.editEmailFormSubmitted = true;
            $scope.passwordIsValidated = false;
            $scope.formValidationError('Please check your password and try again.');
        });
    };

    $scope.updateEmail = function (userClient, valid) {
        $scope.editEmailFormSubmitted = true;
        if (valid) {
            ProfileService.update(userClient).then(function success(response) {
                angular.extend($scope.userClient, response);
                $scope.resetEditEmailForm();
                if (!response.emailValidated) {
                    ValidationService.sendValidationEmail(response).then(function (response) {
                        ProfileService.get(userClientReqdResource).then(function (response) {
                            angular.extend($scope.userClient, response);
                        });
                    });
                }
            }, function error(err) {
                $scope.handleSaveError(err);
            });
        }
    };

    $scope.handleSaveError = function (error) {
        if (error.status === 406 && error.data && error.data.conflicts) {
            var totalErrorCount = error.data.conflicts.length;
            angular.forEach(error.data.conflicts, function (conflict) {
                if ('LOGIN' === conflict.reason) {
                    console.log('login');
                    // login conflict
                    if (!$scope.userClientEdit.useEmail) {
                        // user did not check 'Use Email'
                        $scope.loginError = conflict;
                    } else {
                        // user has checked 'Use Email'
                        conflict.reason = 'EMAIL';
                        $scope.emailError = conflict;
                    }
                } else if ('EMAIL' === conflict.reason && totalErrorCount === 1) {
                    // only show email error if there is not a login error
                    $scope.emailError = conflict;
                }
            });
            if (totalErrorCount > 0) {
                $scope.formValidationError();
            }
        }
    };

    $scope.formValidationError = function (message) {
        var content = message ? message : 'Please correct the below information.';
        if (!$scope.errorAlert) {
            $scope.errorAlert = $alert({
                title: ' ',
                content: content,
                container: '#message-container',
                type: 'danger',
                show: true,
                dismissable: false
            });
        }
    };

    $scope.cancelEmailChange = function () {
        ProfileService.get(userClientReqdResource).then(function(response){
            angular.extend($scope.userClient, response);
            $scope.resetEditEmailForm();
            $scope.promptPasswordModal.hide();
        });
    };

    $scope.resetEditEmailForm = function () {
        $scope.emailEditMode = false;
        $scope.passwordIsValidated = false;
        $scope.password = '';
        $scope.editEmailFormSubmitted = false;
    };
}])
;
