'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionEditController', ['$scope', '$location', 'SecretQuestionService', '$alert', '$modal',
        function ($scope, $location, SecretQuestionService, $alert, $modal) { 	
    	
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
					content: 'The secret questions and responses have been saved successfully.',
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
       
      
       
       function init(){
          console.log('edieweweew');
          	SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content; 
       		});
          	
        	SecretQuestionService.getAllUserSecretQuestionResponse($scope.account).then(function(response) {
            
        	var existingResponse = response.data.content;
            $scope.question1Original = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
            $scope.question1 = angular.copy($scope.question1Original);
            	
            $scope.question2Original =  existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
            $scope.question2 = angular.copy($scope.question2Original);
        	}); 
        }
        
        init();
            
        }
    ])
;
