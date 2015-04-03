'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionController', ['$scope', '$location', 'SecretQuestionService', '$alert', '$q', '$modal',
        function ($scope, $location, SecretQuestionService, $alert, $q, $modal) { 	
    	$scope.validPassword = false;
    	$scope.secretQuestionFormSubmitted = false;
    	var promptPasswordModal = $modal({scope: $scope, template: 'client-facing/secretQuestions/promptPassword.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});
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
	        	$scope.validPassword = false;
    		} else {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
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
    	
    	$scope.validatePassword = function(password) {
    		$scope.passowrd = password;
    		SecretQuestionService.validatePassword(password).then(
       				function success(response) {
       					$scope.validPassword = true;
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
    	
    	$scope.promptPassword = function() {
 		    console.log('promot password');
            promptPasswordModal.$promise.then(promptPasswordModal.show);
        };
        
    	$scope.cancelPassword = function(){
    		$scope.validPassword = false;
    		promptPasswordModal.$promise.then(promptPasswordModal.hide);
       	};
       	
       /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
       $scope.cancel = function () {
    	   $scope.validPassword = false;
          
       };
       
       $scope.onChange= function(){
   			if(angular.equals($scope.question1.entity.secretQuestion, $scope.question2.entity.secretQuestion) &&
   					!(angular.isUndefined($scope.question1.entity.secretQuestion))){
   				$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', false);
           	}
    		else{
    			$scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', true);
      		}
       };
            
       function init(){
   
          	SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content; 
       		});
          	
          	$scope.question1 = SecretQuestionService.createNewResponse();
          	$scope.question2 = SecretQuestionService.createNewResponse();
            
        }
        
        init();
            
        }
    ])
;
