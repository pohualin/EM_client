'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user clicks an activation link
 */
    .controller('ValidateSecurityQuestionController', ['$rootScope', '$scope', 'Session', '$location', 'ResetClientUserPasswordService', 'resetToken', '$alert', 'SecretQuestionService', 
        function ($rootScope, $scope, Session, $location, ResetClientUserPasswordService, resetToken, $alert, SecretQuestionService) {
    	$scope.countFailed = 0;

    	$scope.verifySecretQuestion = function(valid) {
         	$scope.secretQuestionFormSubmitted = true;
         	if(valid){
        		$scope.questionResponses = [$scope.question1.entity, $scope.question2.entity];
        		SecretQuestionService.validateUserSecurityResponse(resetToken, $scope.questionResponses).then(function(response){
        			if(angular.equals(response.data, 'true')){
        				$scope.secretQuestionForm.response1.$setValidity('incorrectResponse', false);
        				$scope.secretQuestionForm.response2.$setValidity('incorrectResponse', false);
        				
        				$scope.parameter = resetToken;
        				$scope.parameter1 = resetToken;
        				var parameter2 = $scope.questionResponses;
        				SecretQuestionService.setUserInputSecurityResponses($scope.questionResponses);
        				$location.url('/reset_password/reset/' + $scope.parameter).replace();
        			}else {
        				$scope.countFailed ++;
        				$scope.secretQuestionForm.response1.$setValidity('incorrectResponse', true);
        				$scope.secretQuestionForm.response2.$setValidity('incorrectResponse', true);
        				$scope.secretQuestionForm.$invalid = true;
        				if($scope.countFailed >= 4){
        					$rootScope.lockError = true;
        					ResetClientUserPasswordService.lockedOutUserByResetToken(resetToken).then(function(response){
        						if (response.data) {
        							$rootScope.lockExpirationDateTime = response.data.replace(/"/g,'') + 'Z';
                                }
        						$location.path('/login').replace();
        					});
          
        				}
                        if (!$scope.errorAlert) {
                        	$scope.showError('Please try again.');
                        }
                        else{
                        	$scope.errorAlert.destroy();
                        	$scope.showError('Please try again.');
                        }
                    }
        		});
        	       	
    		} else {
                if (!$scope.errorAlert) {
                	$scope.showError('Please correct the below information.');
                }
                else{
                	$scope.errorAlert.destroy();
                	$scope.showError('Please correct the below information.');
                }
            }
               	
        };
        
        $scope.showError = function (message) {
        	     $scope.errorAlert = $alert({
                    title: ' ',
                    content: message,
                    container: '#message-container',
                    type: 'danger',
                    show: true,
                    dismissable: false
                });
       };
        
        function init(){
            $scope.question1 = SecretQuestionService.createNewResponse();
          	$scope.question2 = SecretQuestionService.createNewResponse();
          	SecretQuestionService.getUserExistingSecurityQuestion(resetToken)
        	            .then(function(response) {
        	        		$scope.secretQuestions = response.data.content; 
        		         	$scope.question1.entity.secretQuestion = angular.copy($scope.secretQuestions[0].entity);
          	                $scope.question2.entity.secretQuestion = angular.copy($scope.secretQuestions[1].entity);
          	             },function error(errorResponse) {
                             $location.path('/credentials/reset/failure').replace();
                         }); 
        }
        
        init();
}])
;
