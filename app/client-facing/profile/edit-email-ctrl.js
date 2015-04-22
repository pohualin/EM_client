'use strict';

angular.module('emmiManager')
	.controller('ProfileEditEmailCtrl', ['$scope', '$controller', '$modal', 'focus', 'ProfileService', 'ValidationService', 'ProfileEmailRestrictConfigurationsService', 
        function($scope, $controller, $modal, $focus, ProfileService, ValidationService, ProfileEmailRestrictConfigurationsService){

   	/**
     * Called when save is clicked on editEmailForm
     * 
     */
    $scope.updateEmail = function (userClient, editEmailForm) {
        $scope.editEmailFormSubmitted = true;
        if (userClient.useEmail) {
            userClient.login = userClient.email;
        }
        if (editEmailForm.$valid) {
            ProfileService.update(userClient).then(function success(response) {
                angular.extend($scope.userClient, response);
                $scope.resetEditEmailForm();
                if (!response.emailValidated) {
                    ValidationService.sendValidationEmail(response).then(function (response) {
                        ProfileService.get($scope.userClient).then(function (response) {
                            angular.extend($scope.userClient, response);
                        });
                    });
                }
            }, function error(err) {
            	$scope.handleSaveError(err, editEmailForm);
            });
        }
    };
    
    /**
     * Handle error coming back from server
     * 
     */
    $scope.handleSaveError = function (error, form) {
    	console.log(error);
    	if (error.status === 406 && error.data && error.data.conflicts) {
        	var totalErrorCount = error.data.conflicts.length;
            angular.forEach(error.data.conflicts, function (conflict) {
                if ('LOGIN' === conflict.reason) {
                    // login conflict
                    if (!$scope.userClient.useEmail) {
                        // user did not check 'Use Email'
                        form.login.$setValidity('unique', false);
                    } else {
                        // user has checked 'Use Email'
                        conflict.reason = 'EMAIL';
                        form.email.$setValidity('unique', false);
                    }
                } else if ('EMAIL' === conflict.reason && totalErrorCount === 1) {
                    // only show email error if there is not a login error
                    form.email.$setValidity('unique', false);
                }
            });
            if (totalErrorCount > 0) {
            	$scope.formValidationError();
            }
        }
    	else if (error.status === 406 && error.data.validationError.reason === 'EMAIL_RESTRICTION') {
    	  	  $scope.emailMessage = $scope.validEmailEnding === 1 ? 'Only the following type of email address may be used:'
    	  			  											: 'Only the following types of email addresses may be used:';
              error.data.validationError.validEmailEndings = $scope.validEmailEnding;
              $scope.emailError = error.data.validationError;
              $scope.formValidationError();
        }
    	
       
    };
    
    /**
     * When the 'use email' box is changed set the focus when unchecked.
     */
    $scope.useEmailChange = function () {
        if ($scope.userClient && !$scope.userClient.useEmail) {
            $focus('login');
        } else {
            // make sure login unique error go away when use email is pressed
            $scope.editEmailForm.login.$setValidity('unique', true);
        }
    };
    
    /**
     *  Reset validity whenever user change any value in email or login field
     */
    $scope.resetValidity = function(){
    	$scope.editEmailForm.email.$setValidity('unique', true);
        $scope.editEmailForm.login.$setValidity('unique', true);
        $scope.editEmailForm.email.$setValidity('pattern', true);
        $scope.editEmailFormSubmitted = false;
        $scope.hideErrorAlert();
    };
    
    /**
     * Called when edit mail link is clicked
     */
    $scope.editEmail = function () {
        $scope.promptPasswordModal = {};
        $scope.promptPasswordModal = 
            $modal({scope: $scope, template: 'client-facing/profile/passwordPrompt.html', animation: 'none', backdropAnimation: 'emmi-fade', backdrop: 'static'});
    };

    /**
     * Called when submit is clicked on password validation form
     */
    $scope.verifyPassword = function (form, password){
        ProfileService.verifyPassword($scope.userClient, password).then(function success(response){
            $scope.editEmailFormSubmitted = false;
            $scope.passwordValidationFormSubmitted = false;
            $scope.passwordIsValidated = true;
            $scope.setEmailEditMode(true);
            $scope.promptPasswordModal.hide();
        }, function fail(error){
            $scope.passwordValidationFormSubmitted = true;
            form.password.$setValidity('match', false);
            $scope.formValidationError('Please check your password and try again.');
        });
    };
    
    $scope.resetPasswordFormValidity = function(form){
        form.password.$setValidity('match', true);
    };
    
    /**
     * Called when cancel is clicked from password validation form
     */
    $scope.cancelPasswordValidation = function () {
        $scope.passwordValidationFormSubmitted = false;
        ProfileService.get($scope.userClient).then(function(response){
            angular.extend($scope.userClient, response);
            $scope.promptPasswordModal.destroy();
            $scope.hideErrorAlert();
        });
    };

    /**
     * Handle clicked Cancel from the edit email page
     */
    $scope.resetEditEmailForm = function () {
    	$scope.editEmailFormSubmitted = false;
    	ProfileService.get($scope.userClient).then(function(response){
            angular.extend($scope.userClient, response);
        $scope.setEmailEditMode(false);
        $scope.passwordIsValidated = false;
        $scope.emailError = '';
        $scope.hideErrorAlert();
    	});
    };
    
    /**
     * Retrieve valid email ending for the client
     */
    function getValidEmailEnding() {
    	ProfileEmailRestrictConfigurationsService.allValidEmailEndings().then(function(response){
    		$scope.validEmailEnding = response;
    	});
     }
    getValidEmailEnding();
}])
;
