'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionController', ['$scope', '$location', 'SecretQuestionService', '$alert',
        function ($scope, $location, SecretQuestionService, $alert) { 	
    	
    	$scope.secretQuestionFormSubmitted = false;
    	/**
    	 * When the save button is clicked. Sends all updates
    	 * to the back, then rebinds the form objects with dthe
    	 * results
    	 */
        $scope.saveOrUpdateSecretQuestion = function(valid) {
        	$scope.secretQuestionFormSubmitted = true;
        	if(valid){
        		SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question1.entity);
	        	SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question2.entity);
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
    	
    	
    	/**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
       $scope.cancel = function () {
           $location.path('/');
          
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
