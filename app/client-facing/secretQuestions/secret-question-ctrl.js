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
        	console.log('save clicked');
        	
    		if(valid){
        	    console.log('saving secret questions' + $scope.question1.entity.response);
        		console.log('saving secret questions' + $scope.question1.entity.secretQuestion.id);
	        	SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question1.entity).then(function(response) {
	                console.log('saving secret question 1');   
	              });
	        	SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.question2.entity).then(function(response) {
	                console.log('saving secret question 2');   
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
          	console.log('init');
            console.log($scope);
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
