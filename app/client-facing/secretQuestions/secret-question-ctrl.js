'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionController', ['$scope', '$location', 'SecretQuestionService',
        function ($scope, $location, SecretQuestionService) { 	
    	
    	$scope.secretQuestionFormSubmitted = false;
    	/**
    	 * When the save button is clicked. Sends all updates
    	 * to the back, then rebinds the form objects with the
    	 * results
    	 */
        $scope.saveOrUpdateSecretQuestion = function(valid) {
        	$scope.secretQuestionFormSubmitted = true;
        	if(valid){
        	    SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question1.entity).then(function(response) {
	            });
	        	SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question2.entity).then(function(response) {
	            });
	        	$location.path('/client-facing/main/main.html');
    		}
    	};
        
        /**
         * Called when cancel is clicked.. takes the original
         * objects and copies them back into the bound objects.
         */
        $scope.cancel = function() {
           $location.path('/client-facing/main/main.html');
          
       };
       
        
        function init(){
            $scope.secretQuestionForm = 'valid';
            
          	SecretQuestionService.getSecretQuestions().then(function(response) {
          		$scope.secretQuestions = response.data.content; 
       		});
          	
        	SecretQuestionService.getAllUserSecretQuestionResponse().then(function(response) {
            
        	var existingResponse = response.data.content;
            $scope.question1Original = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
            $scope.question1 = angular.copy($scope.question1Original);
            	
            $scope.question2Original =  existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
            $scope.question2 = angular.copy($scope.question2Original);
        	}); 
        };
        
        init();
            
        }
    ])
;
