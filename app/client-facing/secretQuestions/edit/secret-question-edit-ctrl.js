'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionEditController', ['$scope', '$location', 'SecretQuestionService', '$alert', '$modal',
        function ($scope, $location, SecretQuestionService, $alert, $modal) { 	
    	
    	$scope.secretQuestionFormSubmitted = false;
    	var promptPasswordModal = $modal({scope: $scope, template: 'client-facing/secretQuestions/edit/promptPassword.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});
    	
    	/**
    	 * When the save button is clicked. Sends all updates
    	 * to the back, then re-binds the form objects with the
    	 * results
    	 */
        $scope.saveOrUpdateSecretQuestion = function(valid) {
        	$scope.secretQuestionFormSubmitted = true;
        	if(valid){
        		SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question1.entity, $scope.question2.entity);
	        	$alert({
					title: ' ',
					content: 'Your security questions have been updated successfully.',
					container: 'body',
					type: 'success',
					placement: 'top',
				    show: true,
				    duration: 5,
				    dismissable: true
				});
	        	$location.path('/');
    		} else {
                if (!$scope.formAlert) {
                    $scope.formAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            }
        	
    	};
    	
    	/**
    	 * When the save button is clicked. Check if the user
    	 * selected 2 same questions or not
    	 */
    	$scope.onChange= function(){
    		if(angular.equals($scope.question1.entity.secretQuestion, $scope.question2.entity.secretQuestion) &&
    		   !(angular.isUndefined($scope.question1.entity.secretQuestion))){
    			$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', false);
           	}
    		else{
    			$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', true);
      		}
    	};
      	
    	$scope.promptPassword = function() {
    		   
               promptPasswordModal.$promise.then(promptPasswordModal.show);
        };
    	
    	$scope.validatePassword = function(password) {
    		$scope.passowrd = password;
    		SecretQuestionService.getAllUserSecretQuestionResponse(password).then(
       				function success(response) {
		       			var existingResponse = response.data.content;
		                $scope.question1Original = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
		                $scope.question1 = angular.copy($scope.question1Original);
		                $scope.question2Original =  existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
		                $scope.question2 = angular.copy($scope.question2Original);
		                promptPasswordModal.$promise.then(promptPasswordModal.hide);
       				}, 
	            	function error(response){
	            		if (response.status === 403){
	            			if (!$scope.errorAlert) {
	                            $scope.errorAlert = $alert({
	                                title: ' ',
	                                content: 'Please check your password and try again.',
	                                container: '#message-container',
	                                type: 'danger',
	                                show: true,
	                                dismissable: false
	                            });
	                        }
	            		}
	            	});    
       	
       	};
       	
       	$scope.cancelPassword = function(){
       		$location.path('/viewSecretQuestions');
       	};
    	
        /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
    	$scope.cancel = function () {
           $location.path('/');
          
       };
        
           
       function init(){
    	   SecretQuestionService.getSecretQuestions().then(function(response) {
         		$scope.secretQuestions = response.data.content; 
      		});
    	   $scope.promptPassword();
              	
       }
        
       init();
    }])
;


